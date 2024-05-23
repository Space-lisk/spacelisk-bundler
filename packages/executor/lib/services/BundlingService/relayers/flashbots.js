import { IEntryPoint__factory } from "../../../../../types/lib/executor/contracts/index.js";
import { FlashbotsBundleProvider, FlashbotsBundleResolution, } from "@flashbots/ethers-provider-bundle";
import { estimateBundleGasLimit } from "../utils/index.js";
import { now } from "../../../utils/index.js";
import { BaseRelayer } from "./base.js";
export class FlashbotsRelayer extends BaseRelayer {
    constructor(logger, chainId, provider, config, networkConfig, mempoolService, reputationService, eventBus, metrics) {
        super(logger, chainId, provider, config, networkConfig, mempoolService, reputationService, eventBus, metrics);
        this.submitTimeout = 5 * 60 * 1000; // 5 minutes
        if (!this.networkConfig.rpcEndpointSubmit) {
            throw Error("If you want to use Flashbots Builder API, please set API url in 'rpcEndpointSubmit' in config file");
        }
    }
    async sendBundle(bundle) {
        const availableIndex = this.getAvailableRelayerIndex();
        if (availableIndex == null)
            return;
        const relayer = this.relayers[availableIndex];
        const mutex = this.mutexes[availableIndex];
        const { entries } = bundle;
        if (!bundle.entries.length)
            return;
        await mutex.runExclusive(async () => {
            const beneficiary = await this.selectBeneficiary(relayer);
            const entryPoint = entries[0].entryPoint;
            const entryPointContract = IEntryPoint__factory.connect(entryPoint, this.provider);
            const txRequest = entryPointContract.interface.encodeFunctionData("handleOps", [entries.map((entry) => entry.userOp), beneficiary]);
            const transactionRequest = {
                to: entryPoint,
                data: txRequest,
                type: 2,
                maxPriorityFeePerGas: bundle.maxPriorityFeePerGas,
                maxFeePerGas: bundle.maxFeePerGas,
                gasLimit: estimateBundleGasLimit(this.networkConfig.bundleGasLimitMarkup, bundle.entries),
                chainId: this.provider._network.chainId,
                nonce: await relayer.getTransactionCount(),
            };
            if (!(await this.validateBundle(relayer, entries, transactionRequest))) {
                return;
            }
            await this.submitTransaction(relayer, transactionRequest)
                .then(async (txHash) => {
                this.logger.debug(`Flashbots: Bundle submitted: ${txHash}`);
                this.logger.debug(`Flashbots: User op hashes ${entries.map((entry) => entry.userOpHash)}`);
                await this.setSubmitted(entries, txHash);
                await this.waitForEntries(entries).catch((err) => this.logger.error(err, "Flashbots: Could not find transaction"));
                this.reportSubmittedUserops(txHash, bundle);
            })
                .catch(async (err) => {
                this.reportFailedBundle();
                // Put all userops back to the mempool
                // if some userop failed, it will be deleted inside handleUserOpFail()
                await this.setNew(entries);
                if (err === "timeout") {
                    this.logger.debug("Flashbots: Timeout");
                    return;
                }
                await this.handleUserOpFail(entries, err);
                return;
            });
        });
    }
    /**
     * signs & sends a transaction
     * @param signer wallet
     * @param transaction transaction request
     * @param storageMap storage map
     * @returns transaction hash
     */
    async submitTransaction(signer, transaction) {
        this.logger.debug(transaction, "Flashbots: Submitting");
        const fbProvider = await FlashbotsBundleProvider.create(this.provider, signer, this.networkConfig.rpcEndpointSubmit, this.config.chainId);
        const submitStart = now();
        return new Promise((resolve, reject) => {
            let lock = false;
            const handler = async (blockNumber) => {
                if (now() - submitStart > this.submitTimeout)
                    return reject("timeout");
                if (lock)
                    return;
                lock = true;
                const targetBlock = blockNumber + 1;
                const signedBundle = await fbProvider.signBundle([
                    { signer, transaction },
                ]);
                this.logger.debug(`Flashbots: Trying to submit to block ${targetBlock}`);
                const bundleReceipt = await fbProvider.sendRawBundle(signedBundle, targetBlock);
                if ("error" in bundleReceipt) {
                    this.provider.removeListener("block", handler);
                    return reject(bundleReceipt.error);
                }
                const waitResponse = await bundleReceipt.wait();
                lock = false;
                if (FlashbotsBundleResolution[waitResponse] === "BundleIncluded") {
                    this.provider.removeListener("block", handler);
                    resolve(bundleReceipt.bundleHash);
                }
                if (FlashbotsBundleResolution[waitResponse] === "AccountNonceTooHigh") {
                    this.provider.removeListener("block", handler);
                    return reject("AccountNonceTooHigh");
                }
            };
            this.provider.on("block", handler);
        });
    }
}
//# sourceMappingURL=flashbots.js.map