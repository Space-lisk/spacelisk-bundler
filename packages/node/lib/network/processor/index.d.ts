import { Config } from "executor/lib/config";
import { NetworkEventBus } from "../events";
import { GossipType } from "../gossip/interface";
import { PendingGossipsubMessage } from "./types";
import { ValidatorFnsModules } from "./gossipHandlers";
import { NetworkWorkerModules } from "./worker";
export type NetworkProcessorModules = NetworkWorkerModules & ValidatorFnsModules & {
    relayersConfig: Config;
    events: NetworkEventBus;
};
export type NetworkProcessorOpts = {
    maxGossipTopicConcurrency?: number;
};
export declare class NetworkProcessor {
    private readonly opts;
    private readonly worker;
    private readonly events;
    private readonly gossipQueues;
    private readonly gossipTopicConcurrency;
    constructor(modules: NetworkProcessorModules, opts: NetworkProcessorOpts);
    stop(): Promise<void>;
    dropAllJobs(): void;
    dumpGossipQueue(topic: GossipType): PendingGossipsubMessage[];
    private onPendingGossipsubMessage;
    private pushPendingGossipsubMessageToQueue;
    private executeWork;
}
//# sourceMappingURL=index.d.ts.map