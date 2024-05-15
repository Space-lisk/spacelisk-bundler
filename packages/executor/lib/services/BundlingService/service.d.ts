import { providers } from "ethers";
import { PerChainMetrics } from "monitoring/lib";
import { Logger } from "types/lib";
import { BundlingMode } from "types/lib/api/interfaces";
import { RelayingMode } from "types/lib/executor";
import { Config } from "../../config";
import { MempoolService } from "../MempoolService";
import { ReputationService } from "../ReputationService";
import { UserOpValidationService } from "../UserOpValidation";
import { ExecutorEventBus } from "../SubscriptionService";
export declare class BundlingService {
    private chainId;
    private provider;
    private mempoolService;
    private userOpValidationService;
    private reputationService;
    private eventBus;
    private config;
    private logger;
    private metrics;
    private mutex;
    private bundlingMode;
    private autoBundlingInterval;
    private autoBundlingCron?;
    private maxBundleSize;
    private networkConfig;
    private relayer;
    private maxSubmitAttempts;
    constructor(chainId: number, provider: providers.JsonRpcProvider, mempoolService: MempoolService, userOpValidationService: UserOpValidationService, reputationService: ReputationService, eventBus: ExecutorEventBus, config: Config, logger: Logger, metrics: PerChainMetrics | null, relayingMode: RelayingMode);
    setMaxBundleSize(size: number): void;
    setBundlingMode(mode: BundlingMode): void;
    setBundlingInverval(interval: number): void;
    private createBundle;
    private restartCron;
    sendNextBundle(): Promise<void>;
    private tryBundle;
}
//# sourceMappingURL=service.d.ts.map