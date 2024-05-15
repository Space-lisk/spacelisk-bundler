/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { BigNumber } from "ethers";
import { chainsWithoutEIP1559 } from "params/lib/index.js";
import { Web3, Debug, Eth, Skandha } from "./modules/index.js";
import { MempoolService, UserOpValidationService, BundlingService, ReputationService, P2PService, EventsService, ExecutorEventBus, SubscriptionService, } from "./services/index.js";
export class Executor {
    constructor(options) {
        var _a;
        this.version = options.version;
        this.db = options.db;
        this.config = options.config;
        this.logger = options.logger;
        this.chainId = options.chainId;
        this.getNodeApi = (_a = options.getNodeApi) !== null && _a !== void 0 ? _a : (() => null);
        this.metrics = options.metrics;
        this.networkConfig = options.config.getNetworkConfig();
        this.provider = this.config.getNetworkProvider();
        this.eventBus = new ExecutorEventBus();
        this.subscriptionService = new SubscriptionService(this.eventBus, this.logger);
        this.reputationService = new ReputationService(this.db, this.chainId, this.networkConfig.minInclusionDenominator, this.networkConfig.throttlingSlack, this.networkConfig.banSlack, BigNumber.from(this.networkConfig.minStake), this.networkConfig.minUnstakeDelay);
        this.mempoolService = new MempoolService(this.db, this.chainId, this.reputationService, this.eventBus, this.networkConfig, this.logger);
        this.skandha = new Skandha(this.getNodeApi, this.mempoolService, this.chainId, this.provider, this.config, this.logger);
        this.userOpValidationService = new UserOpValidationService(this.skandha, this.provider, this.reputationService, this.chainId, this.config, this.logger);
        this.bundlingService = new BundlingService(this.chainId, this.provider, this.mempoolService, this.userOpValidationService, this.reputationService, this.eventBus, this.config, this.logger, this.metrics, this.networkConfig.relayingMode);
        this.eventsService = new EventsService(this.chainId, this.provider, this.logger, this.reputationService, this.mempoolService, this.eventBus, this.networkConfig.entryPoints, this.db);
        this.eventsService.initEventListener();
        this.web3 = new Web3(this.config, this.version);
        this.debug = new Debug(this.provider, this.bundlingService, this.mempoolService, this.reputationService, this.networkConfig);
        this.eth = new Eth(this.chainId, this.provider, this.userOpValidationService, this.mempoolService, this.skandha, this.networkConfig, this.logger, this.metrics, this.getNodeApi);
        this.p2pService = new P2PService(this.mempoolService);
        if (this.config.testingMode || options.bundlingMode == "manual") {
            this.bundlingService.setBundlingMode("manual");
            this.logger.info("[X] MANUAL BUNDLING");
        }
        if (this.config.testingMode) {
            this.bundlingService.setMaxBundleSize(10);
        }
        if (this.networkConfig.conditionalTransactions) {
            this.logger.info("[x] CONDITIONAL TRANSACTIONS");
        }
        if (this.networkConfig.rpcEndpointSubmit) {
            this.logger.info("[x] SEPARATE RPC FOR SUBMITTING BUNDLES");
        }
        if (this.networkConfig.enforceGasPrice) {
            this.logger.info("[x] ENFORCING GAS PRICES");
        }
        // can't use eip2930 in unsafeMode and on chains that dont support 1559
        if ((this.config.unsafeMode ||
            chainsWithoutEIP1559.some((chainId) => chainId === this.chainId)) &&
            this.networkConfig.eip2930) {
            this.logger.error("Can not use EIP-2930 in unsafe mode or on chains that dont supports EIP-1559");
            throw new Error("disable EIP2930");
        }
        if (this.networkConfig.eip2930) {
            this.logger.info("[x] EIP2930 ENABLED");
        }
        this.logger.info(`[x] USEROPS TTL - ${this.networkConfig.useropsTTL}`);
        setInterval(() => {
            this.subscriptionService.onPing();
        }, 3000);
    }
}
//# sourceMappingURL=executor.js.map