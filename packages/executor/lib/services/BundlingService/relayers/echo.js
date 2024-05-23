import { providers } from "ethers";
import { IEntryPoint__factory } from "../../../../../types/lib/executor/contracts/index.js";
import { estimateBundleGasLimit } from "../utils/index.js";
import { now } from "../../../utils/index.js";
import { BaseRelayer } from "./base.js";
export class EchoRelayer extends BaseRelayer {
    constructor(logger, chainId, provider, config, networkConfig, mempoolService, reputationService, eventBus, metrics) {
        super(logger, chainId, provider, config, networkConfig, mempoolService, reputationService, eventBus, metrics);
        this.submitTimeout = 5 * 60 * 1000; // 5 minutes
        if (this.networkConfig.echoAuthKey.length === 0) {
            throw new Error("Echo API key is missing");
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
                this.logger.debug(`Echo: Bundle submitted: ${txHash}`);
                this.logger.debug(`Echo: User op hashes ${entries.map((entry) => entry.userOpHash)}`);
                await this.setSubmitted(entries, txHash);
                await this.waitForEntries(entries).catch((err) => this.logger.error(err, "Echo: Could not find transaction"));
                this.reportSubmittedUserops(txHash, bundle);
            })
                .catch(async (err) => {
                this.reportFailedBundle();
                // Put all userops back to the mempool
                // if some userop failed, it will be deleted inside handleUserOpFail()
                await this.setNew(entries);
                if (err === "timeout") {
                    this.logger.debug("Echo: Timeout");
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
        this.logger.debug(transaction, "Echo: Submitting");
        const echoProvider = new providers.JsonRpcProvider({
            url: this.networkConfig.rpcEndpointSubmit,
            headers: {
                "x-api-key": this.networkConfig.echoAuthKey,
            },
        });
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
                const txsSigned = [await signer.signTransaction(transaction)];
                this.logger.debug(`Echo: Trying to submit to block ${targetBlock}`);
                try {
                    const bundleReceipt = await echoProvider.send("eth_sendBundle", [
                        {
                            txs: txsSigned,
                            blockNumber: targetBlock,
                            awaitReceipt: true,
                            usePublicMempool: false,
                        },
                    ]);
                    this.logger.debug(bundleReceipt, "Echo: received receipt");
                    lock = false;
                    if (bundleReceipt == null ||
                        bundleReceipt.receiptNotification == null) {
                        return; // try again
                    }
                    if (bundleReceipt.receiptNotification.status === "included") {
                        this.provider.removeListener("block", handler);
                        resolve(bundleReceipt.bundleHash);
                    }
                    if (bundleReceipt.receiptNotification.status === "timedOut") {
                        return; // try again
                    }
                }
                catch (err) {
                    this.logger.error(err, "Echo: received error");
                    this.provider.removeListener("block", handler);
                    return reject(err);
                }
            };
            this.provider.on("block", handler);
        });
    }
}
//# sourceMappingURL=echo.js.map