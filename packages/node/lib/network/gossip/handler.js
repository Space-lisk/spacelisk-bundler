import { GossipSub } from "@chainsafe/libp2p-gossipsub";
import logger from "api/lib/logger.js";
import { GOSSIP_MAX_SIZE } from "types/lib/sszTypes.js";
import { SignaturePolicy } from "@chainsafe/libp2p-gossipsub/types";
import { NetworkEvent } from "../events.js";
import { GossipType, } from "./interface.js";
import { GossipTopicCache, getGossipSSZType, stringifyGossipTopic, } from "./topic.js";
import { DataTransformSnappy } from "./encoding.js";
export class BundlerGossipsub extends GossipSub {
    constructor(modules) {
        const gossipTopicCache = new GossipTopicCache();
        super({
            peerId: modules.libp2p.peerId,
            peerStore: modules.libp2p.peerStore,
            registrar: modules.libp2p.registrar,
            connectionManager: modules.libp2p.connectionManager,
        }, {
            globalSignaturePolicy: SignaturePolicy.StrictNoSign,
            dataTransform: new DataTransformSnappy(gossipTopicCache, GOSSIP_MAX_SIZE),
        });
        this.logger = logger;
        this.gossipTopicCache = gossipTopicCache;
        this.events = modules.events;
        this.monitoring = modules.metrics;
        this.addEventListener("gossipsub:message", this.onGossipsubMessage.bind(this));
    }
    /**
     * Publish a `GossipObject` on a `GossipTopic`
     */
    async publishObject(topic, object) {
        const topicStr = this.getGossipTopicString(topic);
        const sszType = getGossipSSZType(topic);
        const messageData = sszType.serialize(object);
        const result = await this.publish(topicStr, messageData);
        const sentPeers = result.recipients.length;
        this.logger.debug({ topic: topicStr, sentPeers }, "Publish to topic");
        return sentPeers;
    }
    /**
     * Subscribe to a `GossipTopic`
     */
    subscribeTopic(topic) {
        const topicStr = this.getGossipTopicString(topic);
        // Register known topicStr
        this.gossipTopicCache.setTopic(topicStr, topic);
        this.logger.debug({ topic: topicStr }, "Subscribe to gossipsub topic");
        this.subscribe(topicStr);
    }
    /**
     * Unsubscribe to a `GossipTopic`
     */
    unsubscribeTopic(topic) {
        const topicStr = this.getGossipTopicString(topic);
        this.logger.debug({ topic: topicStr }, "Unsubscribe to gossipsub topic");
        this.unsubscribe(topicStr);
    }
    getGossipTopicString(topic) {
        return stringifyGossipTopic(topic);
    }
    async publishVerifiedUserOperation(userOpsWithEP, mempool) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await this.publishObject({
            type: GossipType.user_operations,
            mempool: mempool,
        }, userOpsWithEP);
    }
    onGossipsubMessage(event) {
        const { propagationSource, msgId, msg } = event.detail;
        try {
            // Also validates that the topicStr is known
            const topic = this.gossipTopicCache.getTopic(msg.topic);
            // Get seenTimestamp before adding the message to the queue or add async delays
            const seenTimestampSec = Date.now() / 1000;
            // Emit message to network processor, use setTimeout to yield to the macro queue
            // This is mostly due to too many attestation messages, and a gossipsub RPC may
            // contain multiple of them. This helps avoid the I/O lag issue.
            setTimeout(() => {
                this.events.emit(NetworkEvent.pendingGossipsubMessage, {
                    topic,
                    msg,
                    msgId,
                    propagationSource,
                    seenTimestampSec,
                    startProcessUnixSec: null,
                });
            }, 0);
        }
        catch (err) {
            this.logger.error(err);
        }
    }
}
//# sourceMappingURL=handler.js.map