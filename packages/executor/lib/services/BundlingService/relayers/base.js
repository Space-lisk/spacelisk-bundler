import { Mutex } from "async-mutex";
import { constants, utils } from "ethers";
import { MempoolEntryStatus } from "../../../../../types/lib/executor/index.js";
import { getAddr, now } from "../../../utils/index.js";
const WAIT_FOR_TX_MAX_RETRIES = 3; // 3 blocks
export class BaseRelayer {
    constructor(logger, chainId, provider, config, networkConfig, mempoolService, reputationService, eventBus, metrics) {
        this.logger = logger;
        this.chainId = chainId;
        this.provider = provider;
        this.config = config;
        this.networkConfig = networkConfig;
        this.mempoolService = mempoolService;
        this.reputationService = reputationService;
        this.eventBus = eventBus;
        this.metrics = metrics;
        const relayers = this.config.getRelayers();
        if (!relayers)
            throw new Error("Relayers are not set");
        this.relayers = [...relayers];
        this.mutexes = this.relayers.map(() => new Mutex());
    }
    isLocked() {
        return this.mutexes.every((mutex) => mutex.isLocked());
    }
    sendBundle(_bundle) {
        throw new Error("Method not implemented.");
    }
    getAvailableRelayersCount() {
        return this.mutexes.filter((mutex) => !mutex.isLocked()).length;
    }
    async canSubmitBundle() {
        return true;
    }
    /**
     * waits entries to get submitted
     * @param hashes user op hashes array
     */
    async waitForEntries(entries) {
        let retries = 0;
        if (entries.length == 0)
            return;
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                if (retries >= WAIT_FOR_TX_MAX_RETRIES) {
                    clearInterval(interval);
                    reject(false);
                }
                retries++;
                for (const entry of entries) {
                    const exists = await this.mempoolService.find(entry);
                    // if some entry exists in the mempool, it means that the EventService did not delete it yet
                    // because that service has not received UserOperationEvent yet
                    // so we wait for it to get submitted...
                    if (exists)
                        return;
                }
                clearInterval(interval);
                resolve();
            }, this.networkConfig.bundleInterval);
        });
    }
    getAvailableRelayerIndex() {
        const index = this.mutexes.findIndex((mutex) => !mutex.isLocked());
        if (index === -1) {
            return null;
        }
        return index;
    }
    async handleUserOpFail(entries, err) {
        if (err.errorName !== "FailedOp") {
            this.logger.error(`Failed handleOps, but non-FailedOp error ${JSON.stringify(err, undefined, 2)}`);
            return;
        }
        const { index, paymaster, reason } = err.errorArgs;
        const failedEntry = entries[index];
        if (paymaster !== constants.AddressZero) {
            await this.reputationService.crashedHandleOps(paymaster);
        }
        else if (typeof reason === "string" && reason.startsWith("AA1")) {
            const factory = getAddr(failedEntry === null || failedEntry === void 0 ? void 0 : failedEntry.userOp.initCode);
            if (factory) {
                await this.reputationService.crashedHandleOps(factory);
            }
        }
        else {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (failedEntry) {
                this.logger.debug(`${failedEntry.hash} reverted on chain. Deleting...`);
                await this.mempoolService.updateStatus([failedEntry], MempoolEntryStatus.Reverted, {
                    revertReason: reason,
                });
                this.logger.error(`Failed handleOps sender=${failedEntry.userOp.sender}`);
            }
        }
    }
    // metrics
    reportSubmittedUserops(txHash, bundle) {
        if (txHash && this.metrics) {
            this.metrics.bundlesSubmitted.inc(1);
            this.metrics.useropsSubmitted.inc(bundle.entries.length);
            this.metrics.useropsInBundle.observe(bundle.entries.length);
            bundle.entries.forEach((entry) => {
                var _a;
                this.metrics.useropsTimeToProcess.observe(Math.ceil((now() - ((_a = entry.submittedTime) !== null && _a !== void 0 ? _a : entry.lastUpdatedTime)) / 1000));
            });
        }
    }
    reportFailedBundle() {
        if (this.metrics) {
            this.metrics.bundlesFailed.inc(1);
        }
    }
    /**
     * determine who should receive the proceedings of the request.
     * if signer's balance is too low, send it to signer. otherwise, send to configured beneficiary.
     */
    async selectBeneficiary(relayer) {
        const config = this.config.getNetworkConfig();
        let beneficiary = this.config.getBeneficiary();
        if (!beneficiary || !utils.isAddress(beneficiary)) {
            return relayer.getAddress();
        }
        const signerAddress = await relayer.getAddress();
        const currentBalance = await this.provider.getBalance(signerAddress);
        if (currentBalance.lte(config.minSignerBalance) || !beneficiary) {
            beneficiary = signerAddress;
            this.logger.info(`low balance on ${signerAddress}. using it as beneficiary`);
        }
        return beneficiary;
    }
    /**
     * calls eth_estimateGas with whole bundle
     */
    async validateBundle(relayer, entries, transactionRequest) {
        if (this.networkConfig.skipBundleValidation)
            return true;
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { gasLimit, ...txWithoutGasLimit } = transactionRequest;
            // some chains, like Bifrost, don't allow setting gasLimit in estimateGas
            await relayer.estimateGas(txWithoutGasLimit);
            return true;
        }
        catch (err) {
            this.logger.debug(`${entries
                .map((entry) => entry.userOpHash)
                .join("; ")} failed on chain estimation. deleting...`);
            this.logger.error(err);
            await this.setCancelled(entries, "could not estimate bundle");
            this.reportFailedBundle();
            return false;
        }
    }
    async setSubmitted(entries, transaction) {
        await this.mempoolService.updateStatus(entries, MempoolEntryStatus.Submitted, {
            transaction,
        });
    }
    async setCancelled(entries, reason) {
        await this.mempoolService.updateStatus(entries, MempoolEntryStatus.Cancelled, { revertReason: reason });
    }
    async setReverted(entries, reason) {
        await this.mempoolService.updateStatus(entries, MempoolEntryStatus.Reverted, {
            revertReason: reason,
        });
    }
    async setNew(entries) {
        await this.mempoolService.updateStatus(entries, MempoolEntryStatus.New);
    }
}
//# sourceMappingURL=base.js.map