import { utils } from "ethers";
import RpcError from "types/lib/api/errors/rpc-error.js";
import { ReputationStatus, } from "types/lib/executor/index.js";
import * as RpcErrorCodes from "types/lib/api/errors/rpc-error-codes.js";
import { getAddr } from "../../utils/index.js";
import { MAX_MEMPOOL_USEROPS_PER_SENDER, THROTTLED_ENTITY_MEMPOOL_COUNT, } from "./constants.js";
export class MempoolReputationChecks {
    constructor(service, reputationService, networkConfig) {
        this.service = service;
        this.reputationService = reputationService;
        this.networkConfig = networkConfig;
    }
    async checkEntityCountInMempool(entry, accountInfo, factoryInfo, paymasterInfo, aggregatorInfo) {
        const mEntries = await this.service.fetchPendingUserOps();
        const titles = [
            "account",
            "factory",
            "paymaster",
            "aggregator",
        ];
        const count = [1, 1, 1, 1]; // starting all values from one because `entry` param counts as well
        const stakes = [accountInfo, factoryInfo, paymasterInfo, aggregatorInfo];
        for (const mEntry of mEntries) {
            if (utils.getAddress(mEntry.userOp.sender) ==
                utils.getAddress(accountInfo.addr)) {
                count[0]++;
            }
            // counts the number of similar factories, paymasters and aggregator in the mempool
            for (let i = 1; i < 4; ++i) {
                const mEntity = mEntry[titles[i]];
                if (stakes[i] &&
                    mEntity &&
                    utils.getAddress(mEntity) == utils.getAddress(stakes[i].addr)) {
                    count[i]++;
                }
            }
        }
        // check for ban
        for (const [index, stake] of stakes.entries()) {
            if (!stake)
                continue;
            const whitelist = this.networkConfig.whitelistedEntities[titles[index]];
            if (stake.addr &&
                whitelist != null &&
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                whitelist.some((addr) => utils.getAddress(addr) === utils.getAddress(stake.addr))) {
                continue;
            }
            const status = await this.reputationService.getStatus(stake.addr);
            if (status === ReputationStatus.BANNED) {
                throw new RpcError(`${titles[index]} ${stake.addr} is banned`, RpcErrorCodes.PAYMASTER_OR_AGGREGATOR_BANNED);
            }
            if (status === ReputationStatus.THROTTLED &&
                count[index] > THROTTLED_ENTITY_MEMPOOL_COUNT) {
                throw new RpcError(`${titles[index]} ${stake.addr} is throttled`, RpcErrorCodes.PAYMASTER_OR_AGGREGATOR_BANNED);
            }
            const reputationEntry = index === 0 ? null : await this.reputationService.fetchOne(stake.addr);
            const maxMempoolCount = index === 0
                ? MAX_MEMPOOL_USEROPS_PER_SENDER
                : this.reputationService.calculateMaxAllowedMempoolOpsUnstaked(reputationEntry);
            if (count[index] > maxMempoolCount) {
                const checkStake = await this.reputationService.checkStake(stake);
                if (checkStake.code !== 0) {
                    throw new RpcError(checkStake.msg, checkStake.code);
                }
            }
        }
    }
    async checkMultipleRolesViolation(entry) {
        const { userOp } = entry;
        const { otherEntities, accounts } = await this.getKnownEntities();
        if (otherEntities.includes(utils.getAddress(userOp.sender))) {
            throw new RpcError(`The sender address "${userOp.sender}" is used as a different entity in another UserOperation currently in mempool`, RpcErrorCodes.INVALID_OPCODE);
        }
        if (userOp.paymasterAndData.length >= 42) {
            const paymaster = utils.getAddress(getAddr(userOp.paymasterAndData));
            if (accounts.includes(paymaster)) {
                throw new RpcError(`A Paymaster at ${paymaster} in this UserOperation is used as a sender entity in another UserOperation currently in mempool.`, RpcErrorCodes.INVALID_OPCODE);
            }
        }
        if (userOp.initCode.length >= 42) {
            const factory = utils.getAddress(getAddr(userOp.initCode));
            if (accounts.includes(factory)) {
                throw new RpcError(`A Factory at ${factory} in this UserOperation is used as a sender entity in another UserOperation currently in mempool.`, RpcErrorCodes.INVALID_OPCODE);
            }
        }
    }
    async updateSeenStatus(userOp, aggregator) {
        const paymaster = getAddr(userOp.paymasterAndData);
        const factory = getAddr(userOp.initCode);
        await this.reputationService.updateSeenStatus(userOp.sender);
        if (aggregator) {
            await this.reputationService.updateSeenStatus(aggregator);
        }
        if (paymaster) {
            await this.reputationService.updateSeenStatus(paymaster);
        }
        if (factory) {
            await this.reputationService.updateSeenStatus(factory);
        }
    }
    /**
     * returns a list of addresses of all entities in the mempool
     */
    async getKnownEntities() {
        const entities = {
            accounts: [],
            otherEntities: [],
        };
        const entries = await this.service.fetchPendingUserOps();
        for (const entry of entries) {
            entities.accounts.push(utils.getAddress(entry.userOp.sender));
            if (entry.paymaster && entry.paymaster.length >= 42) {
                entities.otherEntities.push(utils.getAddress(getAddr(entry.paymaster)));
            }
            if (entry.factory && entry.factory.length >= 42) {
                entities.otherEntities.push(utils.getAddress(getAddr(entry.factory)));
            }
        }
        return entities;
    }
}
//# sourceMappingURL=reputation.js.map