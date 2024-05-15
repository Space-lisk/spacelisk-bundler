import { Mutex } from "async-mutex";
import { providers } from "ethers";
import { Logger } from "types/lib";
import { PerChainMetrics } from "monitoring/lib";
import { Config } from "../../../config";
import { Bundle, NetworkConfig } from "../../../interfaces";
import { IRelayingMode, Relayer } from "../interfaces";
import { MempoolEntry } from "../../../entities/MempoolEntry";
import { MempoolService } from "../../MempoolService";
import { ReputationService } from "../../ReputationService";
import { ExecutorEventBus } from "../../SubscriptionService";
export declare abstract class BaseRelayer implements IRelayingMode {
    protected logger: Logger;
    protected chainId: number;
    protected provider: providers.JsonRpcProvider;
    protected config: Config;
    protected networkConfig: NetworkConfig;
    protected mempoolService: MempoolService;
    protected reputationService: ReputationService;
    protected eventBus: ExecutorEventBus;
    protected metrics: PerChainMetrics | null;
    protected relayers: Relayer[];
    protected mutexes: Mutex[];
    constructor(logger: Logger, chainId: number, provider: providers.JsonRpcProvider, config: Config, networkConfig: NetworkConfig, mempoolService: MempoolService, reputationService: ReputationService, eventBus: ExecutorEventBus, metrics: PerChainMetrics | null);
    isLocked(): boolean;
    sendBundle(_bundle: Bundle): Promise<void>;
    getAvailableRelayersCount(): number;
    canSubmitBundle(): Promise<boolean>;
    /**
     * waits entries to get submitted
     * @param hashes user op hashes array
     */
    protected waitForEntries(entries: MempoolEntry[]): Promise<void>;
    protected getAvailableRelayerIndex(): number | null;
    protected handleUserOpFail(entries: MempoolEntry[], err: any): Promise<void>;
    protected reportSubmittedUserops(txHash: string, bundle: Bundle): void;
    protected reportFailedBundle(): void;
    /**
     * determine who should receive the proceedings of the request.
     * if signer's balance is too low, send it to signer. otherwise, send to configured beneficiary.
     */
    protected selectBeneficiary(relayer: Relayer): Promise<string>;
    /**
     * calls eth_estimateGas with whole bundle
     */
    protected validateBundle(relayer: Relayer, entries: MempoolEntry[], transactionRequest: providers.TransactionRequest): Promise<boolean>;
    protected setSubmitted(entries: MempoolEntry[], transaction: string): Promise<void>;
    protected setCancelled(entries: MempoolEntry[], reason: string): Promise<void>;
    protected setReverted(entries: MempoolEntry[], reason: string): Promise<void>;
    protected setNew(entries: MempoolEntry[]): Promise<void>;
}
//# sourceMappingURL=base.d.ts.map