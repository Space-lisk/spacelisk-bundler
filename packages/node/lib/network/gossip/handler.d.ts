import { GossipSub } from "@chainsafe/libp2p-gossipsub";
import { Logger } from "api/lib/logger";
import { ts } from "types/lib";
import { AllChainsMetrics } from "monitoring/lib";
import { Libp2p } from "../interface";
import { NetworkEventBus } from "../events";
import { GossipTypeMap, GossipType, GossipTopic, GossipTopicMap } from "./interface";
export type GossipsubModules = {
    libp2p: Libp2p;
    events: NetworkEventBus;
    metrics: AllChainsMetrics | null;
};
export declare class BundlerGossipsub extends GossipSub {
    logger: Logger;
    private readonly gossipTopicCache;
    private readonly events;
    private readonly monitoring;
    constructor(modules: GossipsubModules);
    /**
     * Publish a `GossipObject` on a `GossipTopic`
     */
    publishObject<K extends GossipType>(topic: GossipTopicMap[K], object: GossipTypeMap[K]): Promise<number>;
    /**
     * Subscribe to a `GossipTopic`
     */
    subscribeTopic(topic: GossipTopic): void;
    /**
     * Unsubscribe to a `GossipTopic`
     */
    unsubscribeTopic(topic: GossipTopic): void;
    private getGossipTopicString;
    publishVerifiedUserOperation(userOpsWithEP: ts.VerifiedUserOperation, mempool: string): Promise<void>;
    private onGossipsubMessage;
}
//# sourceMappingURL=handler.d.ts.map