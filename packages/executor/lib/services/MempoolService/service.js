import { Mutex } from "async-mutex";
import { MempoolEntryStatus } from "../../../../types/lib/executor/index.js";
import RpcError from "../../../../types/lib/api/errors/rpc-error.js";
import * as RpcErrorCodes from "../../../../types/lib/api/errors/rpc-error-codes.js";
import { ExecutorEvent } from "../SubscriptionService.js";
import { MempoolEntry } from "../../entities/MempoolEntry.js";
import { getAddr, now } from "../../utils/index.js";
import { rawEntryToMempoolEntry } from "./utils.js";
import { MempoolReputationChecks } from "./reputation.js";
import { ARCHIVE_PURGE_INTERVAL } from "./constants.js";
export class MempoolService {
    constructor(db, chainId, reputationService, eventBus, networkConfig, logger) {
        this.db = db;
        this.chainId = chainId;
        this.reputationService = reputationService;
        this.eventBus = eventBus;
        this.networkConfig = networkConfig;
        this.logger = logger;
        this.mutex = new Mutex();
        this.USEROP_COLLECTION_KEY = `${chainId}:USEROPKEYS`;
        this.USEROP_HASHES_COLLECTION_PREFIX = "USEROPHASH:";
        this.reputationCheck = new MempoolReputationChecks(this, this.reputationService, this.networkConfig);
        setInterval(() => {
            void this.deleteOldUserOps();
        }, ARCHIVE_PURGE_INTERVAL); // 5 minutes
    }
    /**
     * View functions
     */
    async dump() {
        return (await this.fetchPendingUserOps()).map((entry) => entry.serialize());
    }
    async fetchPendingUserOps() {
        return (await this.fetchAll()).filter((entry) => entry.status < MempoolEntryStatus.OnChain);
    }
    async fetchManyByKeys(keys) {
        const rawEntries = await this.db
            .getMany(keys)
            .catch(() => []);
        return rawEntries.map(rawEntryToMempoolEntry);
    }
    async find(entry) {
        return this.findByKey(this.getKey(entry));
    }
    async getEntryByHash(hash) {
        const key = await this.db
            .get(`${this.USEROP_HASHES_COLLECTION_PREFIX}${hash}`)
            .catch(() => null);
        if (!key)
            return null;
        return this.findByKey(key);
    }
    async getNewEntriesSorted(size, offset = 0) {
        const allEntries = await this.fetchAll();
        return allEntries
            .filter((entry) => entry.status === MempoolEntryStatus.New)
            .sort(MempoolEntry.compareByCost)
            .slice(offset, offset + size);
    }
    async validateUserOpReplaceability(userOp, entryPoint) {
        const entry = new MempoolEntry({
            chainId: this.chainId,
            userOp,
            entryPoint,
            prefund: "0",
            userOpHash: "",
        });
        return this.validateReplaceability(entry);
    }
    /**
     * Write functions
     */
    async updateStatus(entries, status, params) {
        for (const entry of entries) {
            entry.setStatus(status, params);
            await this.update(entry);
            // event bus logic
            if ([
                MempoolEntryStatus.Cancelled,
                MempoolEntryStatus.Submitted,
                MempoolEntryStatus.Reverted,
            ].findIndex((st) => st === status) > -1) {
                this.eventBus.emit(ExecutorEvent.submittedUserOps, entry);
            }
        }
    }
    async clearState() {
        await this.mutex.runExclusive(async () => {
            const keys = await this.fetchKeys();
            for (const key of keys) {
                await this.db.del(key);
            }
            await this.db.del(this.USEROP_COLLECTION_KEY);
        });
    }
    async attemptToBundle(entries) {
        for (const entry of entries) {
            entry.submitAttempts++;
            entry.lastUpdatedTime = now();
            await this.update(entry);
        }
    }
    async addUserOp(userOp, entryPoint, prefund, senderInfo, factoryInfo, paymasterInfo, aggregatorInfo, userOpHash, hash, aggregator) {
        const entry = new MempoolEntry({
            chainId: this.chainId,
            userOp,
            entryPoint,
            prefund,
            aggregator,
            hash,
            userOpHash,
            factory: getAddr(userOp.initCode),
            paymaster: getAddr(userOp.paymasterAndData),
            submittedTime: now(),
        });
        await this.mutex.runExclusive(async () => {
            const existingEntry = await this.find(entry);
            if (existingEntry) {
                await this.validateReplaceability(entry, existingEntry);
                await this.db.put(this.getKey(entry), {
                    ...entry,
                    lastUpdatedTime: now(),
                });
                await this.removeUserOpHash(existingEntry.userOpHash);
                await this.saveUserOpHash(entry.userOpHash, entry);
                this.logger.debug("Mempool: User op replaced");
            }
            else {
                await this.reputationCheck.checkEntityCountInMempool(entry, senderInfo, factoryInfo, paymasterInfo, aggregatorInfo);
                await this.reputationCheck.checkMultipleRolesViolation(entry);
                const userOpKeys = await this.fetchKeys();
                const key = this.getKey(entry);
                userOpKeys.push(key);
                await this.db.put(this.USEROP_COLLECTION_KEY, userOpKeys);
                await this.db.put(key, { ...entry, lastUpdatedTime: now() });
                await this.saveUserOpHash(entry.userOpHash, entry);
                this.logger.debug("Mempool: User op added");
            }
            await this.reputationCheck.updateSeenStatus(userOp, aggregator);
            this.eventBus.emit(ExecutorEvent.pendingUserOps, entry);
        });
    }
    async deleteOldUserOps() {
        const removableEntries = (await this.fetchAll()).filter((entry) => {
            if (entry.status < MempoolEntryStatus.OnChain)
                return false;
            if (entry.lastUpdatedTime + this.networkConfig.archiveDuration * 1000 >
                now()) {
                return false;
            }
            return true;
        });
        for (const entry of removableEntries) {
            await this.remove(entry);
        }
    }
    /**
     * Internal
     */
    getKey(entry) {
        const { userOp, chainId } = entry;
        return `${chainId}:${userOp.sender.toLowerCase()}:${userOp.nonce}`;
    }
    async fetchAll() {
        const keys = await this.fetchKeys();
        const rawEntries = await this.db
            .getMany(keys)
            .catch(() => []);
        return rawEntries.map(rawEntryToMempoolEntry);
    }
    async fetchKeys() {
        const userOpKeys = await this.db
            .get(this.USEROP_COLLECTION_KEY)
            .catch(() => []);
        return userOpKeys;
    }
    async findByKey(key) {
        const raw = await this.db.get(key).catch(() => null);
        if (raw) {
            return rawEntryToMempoolEntry(raw);
        }
        return null;
    }
    async validateReplaceability(newEntry, oldEntry) {
        if (!oldEntry) {
            oldEntry = await this.find(newEntry);
        }
        if (!oldEntry ||
            newEntry.canReplaceWithTTL(oldEntry, this.networkConfig.useropsTTL)) {
            return true;
        }
        throw new RpcError("User op cannot be replaced: fee too low", RpcErrorCodes.INVALID_USEROP);
    }
    async update(entry) {
        await this.mutex.runExclusive(async () => {
            await this.db.put(this.getKey(entry), entry);
        });
    }
    async remove(entry) {
        if (!entry) {
            return;
        }
        await this.mutex.runExclusive(async () => {
            const key = this.getKey(entry);
            const newKeys = (await this.fetchKeys()).filter((k) => k !== key);
            await this.db.del(key);
            await this.db.put(this.USEROP_COLLECTION_KEY, newKeys);
            this.logger.debug(`${entry.userOpHash} deleted from mempool`);
        });
    }
    async saveUserOpHash(hash, entry) {
        const key = this.getKey(entry);
        await this.db.put(`${this.USEROP_HASHES_COLLECTION_PREFIX}${hash}`, key);
    }
    async removeUserOpHash(hash) {
        await this.db.del(`${this.USEROP_HASHES_COLLECTION_PREFIX}${hash}`);
    }
}
//# sourceMappingURL=service.js.map