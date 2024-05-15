import { providers } from "ethers";
import { PerChainMetrics } from "monitoring/lib";
import { Logger } from "types/lib";
import { Config } from "../../../config";
import { Bundle, NetworkConfig } from "../../../interfaces";
import { MempoolService } from "../../MempoolService";
import { ReputationService } from "../../ReputationService";
import { ExecutorEventBus } from "../../SubscriptionService";
import { BaseRelayer } from "./base";
export declare class KolibriRelayer extends BaseRelayer {
    constructor(logger: Logger, chainId: number, provider: providers.JsonRpcProvider, config: Config, networkConfig: NetworkConfig, mempoolService: MempoolService, reputationService: ReputationService, eventBus: ExecutorEventBus, metrics: PerChainMetrics | null);
    sendBundle(bundle: Bundle): Promise<void>;
    private submitTransaction;
}
export declare class KolibriJsonRpcProvider extends providers.JsonRpcProvider {
    send(method: string, params: Record<string, any>, authKey?: string): Promise<any>;
}
//# sourceMappingURL=kolibri.d.ts.map