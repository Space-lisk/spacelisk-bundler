import { GossipTopic, GossipTopicTypeMap } from "./interface";
export interface IGossipTopicCache {
    getTopic(topicStr: string): GossipTopic;
}
export declare class GossipTopicCache implements IGossipTopicCache {
    private topicsByTopicStr;
    /** Returns cached GossipTopic, otherwise attempts to parse it from the str */
    getTopic(topicStr: string): GossipTopic;
    /** Returns cached GossipTopic, otherwise returns undefined */
    getKnownTopic(topicStr: string): GossipTopic | undefined;
    setTopic(topicStr: string, topic: GossipTopic): void;
}
/**
 * Stringify a GossipTopic into a spec-ed formated topic string
 */
export declare function stringifyGossipTopic(topic: GossipTopic): string;
export declare function getGossipSSZType(topic: GossipTopic): import("@chainsafe/ssz").ContainerType<{
    user_operation: import("@chainsafe/ssz").ContainerType<{
        sender: import("@chainsafe/ssz").ByteVectorType;
        nonce: import("@chainsafe/ssz").UintBigintType;
        init_code: import("@chainsafe/ssz").ByteListType;
        call_data: import("@chainsafe/ssz").ByteListType;
        call_gas_limit: import("@chainsafe/ssz").UintBigintType;
        verification_gas_limit: import("@chainsafe/ssz").UintBigintType;
        pre_verification_gas: import("@chainsafe/ssz").UintBigintType;
        max_fee_per_gas: import("@chainsafe/ssz").UintBigintType;
        max_priority_fee_per_gas: import("@chainsafe/ssz").UintBigintType;
        paymaster_and_data: import("@chainsafe/ssz").ByteListType;
        signature: import("@chainsafe/ssz").ByteListType;
    }>;
    entry_point: import("@chainsafe/ssz").ByteVectorType;
    verified_at_block_hash: import("@chainsafe/ssz").UintBigintType;
}>;
/**
 * Parse a `GossipTopic` object from its stringified form.
 * A gossip topic has the format
 * ```ts
 * /account_abstraction/$MEMPOOL_ID/$GOSSIP_TYPE/$ENCODING
 * ```
 */
export declare function parseGossipTopic(topicStr: string): Required<GossipTopic>;
export declare function getCoreTopics(): GossipTopicTypeMap[keyof GossipTopicTypeMap][];
//# sourceMappingURL=topic.d.ts.map