import { ssz } from "types/lib/index.js";
import { GossipEncoding, GossipType, } from "./interface.js";
import { DEFAULT_ENCODING } from "./constants.js";
export class GossipTopicCache {
    constructor() {
        this.topicsByTopicStr = new Map();
    }
    /** Returns cached GossipTopic, otherwise attempts to parse it from the str */
    getTopic(topicStr) {
        let topic = this.topicsByTopicStr.get(topicStr);
        if (topic === undefined) {
            topic = parseGossipTopic(topicStr);
            // TODO: Consider just throwing here. We should only receive messages from known subscribed topics
            this.topicsByTopicStr.set(topicStr, topic);
        }
        return topic;
    }
    /** Returns cached GossipTopic, otherwise returns undefined */
    getKnownTopic(topicStr) {
        return this.topicsByTopicStr.get(topicStr);
    }
    setTopic(topicStr, topic) {
        if (!this.topicsByTopicStr.has(topicStr)) {
            this.topicsByTopicStr.set(topicStr, {
                encoding: DEFAULT_ENCODING,
                ...topic,
            });
        }
    }
}
/**
 * Stringify a GossipTopic into a spec-ed formated topic string
 */
export function stringifyGossipTopic(topic) {
    var _a;
    const topicType = stringifyGossipTopicType(topic);
    const encoding = (_a = topic.encoding) !== null && _a !== void 0 ? _a : DEFAULT_ENCODING;
    return `/account_abstraction/${topic.mempool}/${topicType}/${encoding}`;
}
/**
 * Stringify a GossipTopic into a spec-ed formated partial topic string
 */
function stringifyGossipTopicType(topic) {
    switch (topic.type) {
        case GossipType.user_operations:
            return topic.type;
    }
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getGossipSSZType(topic) {
    switch (topic.type) {
        case GossipType.user_operations:
            return ssz.VerifiedUserOperation;
    }
}
// Parsing
const gossipTopicRegex = new RegExp("^/account_abstraction/(\\w+)/(\\w+)/(\\w+)");
/**
 * Parse a `GossipTopic` object from its stringified form.
 * A gossip topic has the format
 * ```ts
 * /account_abstraction/$MEMPOOL_ID/$GOSSIP_TYPE/$ENCODING
 * ```
 */
export function parseGossipTopic(topicStr) {
    try {
        const matches = topicStr.match(gossipTopicRegex);
        if (matches === null) {
            throw Error(`Must match regex ${gossipTopicRegex}`);
        }
        const [, mempool, gossipTypeStr, encodingStr] = matches;
        const encoding = parseEncodingStr(encodingStr);
        // Inline-d the parseGossipTopicType() function since spreading the resulting object x4 the time to parse a topicStr
        switch (gossipTypeStr) {
            case GossipType.user_operations:
                return { type: gossipTypeStr, encoding, mempool };
        }
        throw Error(`Unknown gossip type ${gossipTypeStr}`);
    }
    catch (e) {
        e.message = `Invalid gossip topic ${topicStr}: ${e.message}`;
        throw e;
    }
}
export function getCoreTopics() {
    // Common topics
    const topics = [
        { type: GossipType.user_operations },
    ];
    return topics;
}
/**
 * Validate that a `encodingStr` is a known `GossipEncoding`
 */
function parseEncodingStr(encodingStr) {
    switch (encodingStr) {
        case GossipEncoding.ssz_snappy:
            return encodingStr;
        default:
            throw Error(`Unknown encoding ${encodingStr}`);
    }
}
//# sourceMappingURL=topic.js.map