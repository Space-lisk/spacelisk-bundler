import { providers } from "ethers";
import { IDbController, Logger } from "types/lib";
import { PerChainMetrics } from "monitoring/lib";
import { SkandhaVersion } from "types/lib/executor";
import { Web3, Debug, Eth, Skandha } from "./modules";
import { MempoolService, UserOpValidationService, BundlingService, ReputationService, P2PService, EventsService, ExecutorEventBus, SubscriptionService } from "./services";
import { Config } from "./config";
import { BundlingMode, GetNodeAPI } from "./interfaces";
export interface ExecutorOptions {
    version: SkandhaVersion;
    chainId: number;
    db: IDbController;
    config: Config;
    logger: Logger;
    getNodeApi?: GetNodeAPI;
    bundlingMode: BundlingMode;
    metrics: PerChainMetrics | null;
}
export declare class Executor {
    private networkConfig;
    private logger;
    private metrics;
    version: SkandhaVersion;
    chainId: number;
    config: Config;
    provider: providers.JsonRpcProvider;
    web3: Web3;
    debug: Debug;
    eth: Eth;
    skandha: Skandha;
    bundlingService: BundlingService;
    mempoolService: MempoolService;
    userOpValidationService: UserOpValidationService;
    reputationService: ReputationService;
    p2pService: P2PService;
    eventsService: EventsService;
    eventBus: ExecutorEventBus;
    subscriptionService: SubscriptionService;
    private db;
    private getNodeApi;
    constructor(options: ExecutorOptions);
}
//# sourceMappingURL=executor.d.ts.map