import { mapValues } from "utils/lib/index.js";
import logger from "api/lib/logger.js";
import { NetworkEvent } from "../events.js";
import { GossipType } from "../gossip/interface.js";
import { createGossipQueues } from "./gossipQueues.js";
import { NetworkWorker } from "./worker.js";
/**
 * True if we want to process gossip object immediately, false if we check for bls and regen
 * in order to process the gossip object.
 */
const executeGossipWorkOrderObj = {
    [GossipType.user_operations]: {},
};
const executeGossipWorkOrder = Object.keys(executeGossipWorkOrderObj);
const MAX_JOBS_SUBMITTED_PER_TICK = 128;
export class NetworkProcessor {
    constructor(modules, opts) {
        this.opts = opts;
        this.gossipQueues = createGossipQueues();
        this.gossipTopicConcurrency = mapValues(this.gossipQueues, () => 0);
        const { events } = modules;
        this.events = events;
        this.worker = new NetworkWorker(modules);
        events.on(NetworkEvent.pendingGossipsubMessage, this.onPendingGossipsubMessage.bind(this));
    }
    async stop() {
        this.events.off(NetworkEvent.pendingGossipsubMessage, this.onPendingGossipsubMessage);
    }
    dropAllJobs() {
        for (const topic of executeGossipWorkOrder) {
            this.gossipQueues[topic].clear();
        }
    }
    dumpGossipQueue(topic) {
        const queue = this.gossipQueues[topic];
        if (queue === undefined) {
            throw Error(`Unknown gossipType ${topic}, known values: ${Object.keys(this.gossipQueues).join(", ")}`);
        }
        return queue.getAll();
    }
    onPendingGossipsubMessage(message) {
        this.pushPendingGossipsubMessageToQueue(message);
    }
    pushPendingGossipsubMessageToQueue(message) {
        const topicType = message.topic.type;
        const droppedJob = this.gossipQueues[topicType].add(message);
        if (droppedJob) {
            // TODO: Should report the dropped job to gossip?
        }
        this.executeWork();
    }
    executeWork() {
        let jobsSubmitted = 0;
        job_loop: while (jobsSubmitted < MAX_JOBS_SUBMITTED_PER_TICK) {
            for (const topic of executeGossipWorkOrder) {
                if (this.opts.maxGossipTopicConcurrency !== undefined &&
                    this.gossipTopicConcurrency[topic] >
                        this.opts.maxGossipTopicConcurrency) {
                    // Reached concurrency limit for topic, continue to next topic
                    continue;
                }
                const item = this.gossipQueues[topic].next();
                if (item) {
                    this.gossipTopicConcurrency[topic]++;
                    this.worker
                        .processPendingGossipsubMessage(item)
                        .finally(() => this.gossipTopicConcurrency[topic]--)
                        .catch((e) => 
                    // eslint-disable-next-line no-console
                    logger.error(e, "processGossipAttestations must not throw"));
                    jobsSubmitted++;
                    continue job_loop;
                }
            }
            // No item of work available on all queues, break off job_loop
            break;
        }
    }
}
//# sourceMappingURL=index.js.map