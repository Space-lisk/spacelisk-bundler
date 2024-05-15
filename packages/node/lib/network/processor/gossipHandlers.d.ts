import { Config } from "executor/lib/config";
import { AllChainsMetrics } from "monitoring/lib";
import { Executor } from "executor/lib/executor";
import { GossipHandlers } from "../gossip/interface";
import { NetworkEventBus } from "../events";
export type ValidatorFnsModules = {
    relayersConfig: Config;
    events: NetworkEventBus;
    executor: Executor;
    metrics: AllChainsMetrics | null;
};
export declare function getGossipHandlers(modules: ValidatorFnsModules): GossipHandlers;
//# sourceMappingURL=gossipHandlers.d.ts.map