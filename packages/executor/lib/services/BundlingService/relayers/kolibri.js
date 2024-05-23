import { providers } from "ethers";
import { IEntryPoint__factory } from "../../../../../types/lib/executor/contracts/index.js";
import { fetchJson } from "ethers/lib/utils.js";
import { estimateBundleGasLimit } from "../utils/index.js";
import { BaseRelayer } from "./base.js";
export class KolibriRelayer extends BaseRelayer {
    constructor(logger, chainId, provider, config, networkConfig, mempoolService, reputationService, eventBus, metrics) {
        super(logger, chainId, provider, config, networkConfig, mempoolService, reputationService, eventBus, metrics);
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
            this.logger.debug(transactionRequest, "Kolibri: Submitting");
            await this.submitTransaction(relayer, transactionRequest)
                .then(async (hash) => {
                this.logger.debug(`Bundle submitted: ${hash}`);
                this.logger.debug(`User op hashes ${entries.map((entry) => entry.userOpHash)}`);
                await this.setSubmitted(entries, hash);
                await this.waitForEntries(entries).catch((err) => this.logger.error(err, "Kolibri: Could not find transaction"));
            })
                .catch(async (err) => {
                this.reportFailedBundle();
                await this.setNew(entries);
                await this.handleUserOpFail(entries, err);
            });
        });
    }
    async submitTransaction(relayer, transaction) {
        const signedRawTx = await relayer.signTransaction(transaction);
        const kolibriProvider = new KolibriJsonRpcProvider(this.networkConfig.rpcEndpointSubmit);
        // refer to Kolibri docs - https://docs.kolibr.io/
        const params = {
            tx_raw_data: signedRawTx,
            broadcaster_address: await relayer.getAddress(),
            ofa_config: {
                enabled: true,
                allow_front_run: false,
            },
            submit_config: {
                allow_reverts: false,
                public_fallback: false,
                mode: "private",
            },
        };
        this.logger.debug(params, "Kolibri: request params");
        return await kolibriProvider
            .send("check_and_submit_bev", params)
            .then((result) => {
            this.logger.debug(result, "Kolibri: submit succeed");
            if (result.tx_hash) {
                return result.tx_hash;
            }
            throw new Error("Could not submit transaction");
        })
            .catch((error) => {
            this.logger.error(error, "Kobliri: submit failed");
            throw error;
        });
    }
}
export class KolibriJsonRpcProvider extends providers.JsonRpcProvider {
    send(method, params, authKey) {
        if (authKey != undefined) {
            if (!this.connection.headers) {
                this.connection.headers = {};
            }
            this.connection.headers["authorization"] = authKey;
        }
        // the rest is the copy of JsonRpcProvider.send()
        const request = {
            method: method,
            params: params,
            id: this._nextId++,
            jsonrpc: "2.0",
        };
        return fetchJson(this.connection, JSON.stringify(request), (payload) => {
            if (payload.error) {
                const error = new Error(payload.error.message);
                error.code = payload.error.code;
                error.data = payload.error.data;
                throw error;
            }
            return payload.result;
        });
    }
}
//# sourceMappingURL=kolibri.js.map