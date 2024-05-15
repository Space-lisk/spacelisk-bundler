import { Config } from "executor/lib/config";
import { NetworkEventBus } from "../events";
import { GossipHandlers } from "../gossip/interface";
import { ValidatorFnsModules } from "./gossipHandlers";
import { ValidatorFnModules } from "./gossipValidatorFn";
import { PendingGossipsubMessage } from "./types";
export type NetworkWorkerModules = ValidatorFnsModules & ValidatorFnModules & {
    relayersConfig: Config;
    events: NetworkEventBus;
    gossipHandlers?: GossipHandlers;
};
export declare class NetworkWorker {
    private readonly events;
    private readonly gossipValidatorFn;
    constructor(modules: NetworkWorkerModules);
    processPendingGossipsubMessage(message: PendingGossipsubMessage): Promise<void>;
}
//# sourceMappingURL=worker.d.ts.map