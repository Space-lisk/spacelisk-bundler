import { providers } from "ethers";
import { Logger } from "types/lib";
import { PerChainMetrics } from "monitoring/lib";
import { Config } from "../../../config";
import { Bundle, NetworkConfig } from "../../../interfaces";
import { MempoolService } from "../../MempoolService";
import { ReputationService } from "../../ReputationService";
import { ExecutorEventBus } from "../../SubscriptionService";
import { BaseRelayer } from "./base";
export declare class FastlaneRelayer extends BaseRelayer {
    private submitTimeout;
    constructor(logger: Logger, chainId: number, provider: providers.JsonRpcProvider, config: Config, networkConfig: NetworkConfig, mempoolService: MempoolService, reputationService: ReputationService, eventBus: ExecutorEventBus, metrics: PerChainMetrics | null);
    sendBundle(bundle: Bundle): Promise<void>;
    canSubmitBundle(): Promise<boolean>;
    /**
     * signs & sends a transaction
     * @param relayer wallet
     * @param transaction transaction request
     * @param storageMap storage map
     * @returns transaction hash
     */
    private submitTransaction;
}
//# sourceMappingURL=fastlane.d.ts.map