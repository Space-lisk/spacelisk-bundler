import { IEntryPoint__factory } from "types/lib/executor/contracts/factories/index.js";
import { MempoolEntryStatus } from "types/lib/executor/index.js";
import { ExecutorEvent } from "./SubscriptionService.js";
/**
 * Listens for events in the blockchain
 */
export class EventsService {
    constructor(chainId, provider, logger, reputationService, mempoolService, eventBus, entryPointAddrs, db) {
        this.chainId = chainId;
        this.provider = provider;
        this.logger = logger;
        this.reputationService = reputationService;
        this.mempoolService = mempoolService;
        this.eventBus = eventBus;
        this.entryPointAddrs = entryPointAddrs;
        this.db = db;
        this.entryPoints = [];
        this.lastBlockPerEntryPoint = {};
        this.eventAggregator = null;
        this.eventAggregatorTxHash = null;
        this.LAST_BLOCK_KEY = `${this.chainId}:LAST_BLOCK_PER_ENTRY_POINTS`;
        for (const entryPoint of this.entryPointAddrs) {
            const contract = IEntryPoint__factory.connect(entryPoint, this.provider);
            this.entryPoints.push(contract);
        }
    }
    initEventListener() {
        for (const contract of this.entryPoints) {
            contract.on(contract.filters.UserOperationEvent(), async (...args) => {
                const ev = args[args.length - 1];
                await this.handleEvent(ev);
            });
        }
    }
    onUserOperationEvent(callback) {
        for (const contract of this.entryPoints) {
            contract.on(contract.filters.UserOperationEvent(), callback);
        }
    }
    offUserOperationEvent(callback) {
        for (const contract of this.entryPoints) {
            contract.off(contract.filters.UserOperationEvent(), callback);
        }
    }
    /**
     * manually handle all new events since last run
     */
    async handlePastEvents() {
        var _a;
        await this.fetchLastBlockPerEntryPoints();
        for (const contract of this.entryPoints) {
            const { address } = contract;
            const events = await contract.queryFilter({ address: contract.address }, this.lastBlockPerEntryPoint[address]);
            for (const ev of events) {
                await this.handleEvent(ev);
            }
            if (events.length > 0) {
                const lastEvent = events[events.length - 1];
                const blockNum = lastEvent.blockNumber;
                if (!((_a = this.lastBlockPerEntryPoint[address]) !== null && _a !== void 0 ? _a : 0) ||
                    Number(this.lastBlockPerEntryPoint[address]) < blockNum) {
                    this.lastBlockPerEntryPoint[address] = blockNum;
                }
            }
        }
        await this.saveLastBlockPerEntryPoints();
    }
    async handleEvent(ev) {
        switch (ev.event) {
            case "UserOperationEvent":
                await this.handleUserOperationEvent(ev);
                break;
            case "AccountDeployedEvent":
                await this.handleAccountDeployedEvent(ev);
                break;
            case "SignatureAggregatorForUserOperations":
                await this.handleAggregatorChangedEvent(ev);
                break;
        }
    }
    async handleAggregatorChangedEvent(ev) {
        this.eventAggregator = ev.args.aggregator;
        this.eventAggregatorTxHash = ev.transactionHash;
    }
    // aggregator event is sent once per events bundle for all UserOperationEvents in this bundle.
    // it is not sent at all if the transaction is handleOps
    getEventAggregator(ev) {
        if (ev.transactionHash !== this.eventAggregatorTxHash) {
            this.eventAggregator = null;
            this.eventAggregatorTxHash = ev.transactionHash;
        }
        return this.eventAggregator;
    }
    // AccountDeployed event is sent before each UserOperationEvent that deploys a contract.
    async handleAccountDeployedEvent(ev) {
        await this.includedAddress(ev.args.factory);
    }
    async handleUserOperationEvent(ev) {
        const entry = await this.mempoolService.getEntryByHash(ev.args.userOpHash);
        if (entry) {
            this.logger.debug(`Found UserOperationEvent for ${ev.args.userOpHash}. Deleting userop...`);
            await this.mempoolService.updateStatus([entry], MempoolEntryStatus.OnChain, { transaction: ev.transactionHash });
            this.eventBus.emit(ExecutorEvent.onChainUserOps, entry);
        }
        await this.includedAddress(ev.args.sender);
        await this.includedAddress(ev.args.paymaster);
        await this.includedAddress(this.getEventAggregator(ev));
    }
    async includedAddress(data) {
        if (data != null && data.length >= 42) {
            const addr = data.slice(0, 42);
            await this.reputationService.updateIncludedStatus(addr);
        }
    }
    async saveLastBlockPerEntryPoints() {
        await this.db.put(this.LAST_BLOCK_KEY, this.lastBlockPerEntryPoint);
    }
    async fetchLastBlockPerEntryPoints() {
        const entry = await this.db
            .get(this.LAST_BLOCK_KEY)
            .catch(() => null);
        if (entry) {
            this.lastBlockPerEntryPoint = entry;
        }
    }
}
//# sourceMappingURL=EventsService.js.map