import { GossipType } from "../gossip/interface";
declare enum QueueType {
    FIFO = "FIFO",
    LIFO = "LIFO"
}
type GossipQueueOpts = {
    type: QueueType;
    maxLength: number;
};
export declare class GossipQueue<T> {
    private readonly opts;
    private readonly list;
    constructor(opts: GossipQueueOpts);
    get length(): number;
    clear(): void;
    add(item: T): T | null;
    next(): T | null;
    getAll(): T[];
}
/**
 * Wraps a GossipValidatorFn with a queue, to limit the processing of gossip objects by type.
 *
 * A queue here is essential to protect against DOS attacks, where a peer may send many messages at once.
 * Queues also protect the node against overloading. If the node gets bussy with an expensive epoch transition,
 * it may buffer too many gossip objects causing an Out of memory (OOM) error. With a queue the node will reject
 * new objects to fit its current throughput.
 *
 * Queues may buffer objects by
 *  - topic '/eth2/0011aabb/beacon_attestation_0/ssz_snappy'
 *  - type `GossipType.beacon_attestation`
 *  - all objects in one queue
 *
 * By topic is too specific, so by type groups all similar objects in the same queue. All in the same won't allow
 * to customize different queue behaviours per object type (see `gossipQueueOpts`).
 */
export declare function createGossipQueues<T>(): {
    [K in GossipType]: GossipQueue<T>;
};
export {};
//# sourceMappingURL=gossipQueues.d.ts.map