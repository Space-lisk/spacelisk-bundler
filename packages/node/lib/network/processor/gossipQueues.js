import { mapValues, LinkedList } from "utils/lib/index.js";
import { GossipType } from "../gossip/interface.js";
var QueueType;
(function (QueueType) {
    QueueType["FIFO"] = "FIFO";
    QueueType["LIFO"] = "LIFO";
})(QueueType || (QueueType = {}));
/**
 * Numbers from https://github.com/sigp/lighthouse/blob/b34a79dc0b02e04441ba01fd0f304d1e203d877d/beacon_node/network/src/beacon_processor/mod.rs#L69
 */
const gossipQueueOpts = {
    // validation gossip block asap
    [GossipType.user_operations]: {
        maxLength: 256,
        type: QueueType.FIFO,
    },
};
export class GossipQueue {
    constructor(opts) {
        this.opts = opts;
        this.list = new LinkedList();
    }
    get length() {
        return this.list.length;
    }
    clear() {
        this.list.clear();
    }
    add(item) {
        let droppedItem = null;
        if (this.list.length + 1 > this.opts.maxLength) {
            // LIFO -> keep latest job, drop oldest, FIFO -> drop latest job
            switch (this.opts.type) {
                case QueueType.LIFO:
                    droppedItem = this.list.shift();
                    break;
                case QueueType.FIFO:
                    return item;
            }
        }
        this.list.push(item);
        return droppedItem;
    }
    next() {
        // LIFO -> pop() remove last item, FIFO -> shift() remove first item
        switch (this.opts.type) {
            case QueueType.LIFO:
                return this.list.pop();
            case QueueType.FIFO:
                return this.list.shift();
        }
    }
    getAll() {
        return this.list.toArray();
    }
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
export function createGossipQueues() {
    return mapValues(gossipQueueOpts, (opts) => {
        return new GossipQueue(opts);
    });
}
//# sourceMappingURL=gossipQueues.js.map