import { Message } from "@libp2p/interface-pubsub";
import { RPC } from "@chainsafe/libp2p-gossipsub/message";
import { GossipTopicCache } from "./topic";
/**
 * The function used to generate a gossipsub message id
 * We use the first 8 bytes of SHA256(data) for content addressing
 */
export declare function fastMsgIdFn(rpcMsg: RPC.IMessage): string;
export declare function msgIdToStrFn(msgId: Uint8Array): string;
/**
 * Only valid msgId. Messages that fail to snappy_decompress() are not tracked
 */
export declare function msgIdFn(gossipTopicCache: GossipTopicCache, msg: Message): Uint8Array;
export declare class DataTransformSnappy {
    private readonly gossipTopicCache;
    private readonly maxSizePerMessage;
    constructor(gossipTopicCache: GossipTopicCache, maxSizePerMessage: number);
    /**
     * Takes the data published by peers on a topic and transforms the data.
     * Should be the reverse of outboundTransform(). Example:
     * - `inboundTransform()`: decompress snappy payload
     * - `outboundTransform()`: compress snappy payload
     */
    inboundTransform(topicStr: string, data: Uint8Array): Uint8Array;
    /**
     * Takes the data to be published (a topic and associated data) transforms the data. The
     * transformed data will then be used to create a `RawGossipsubMessage` to be sent to peers.
     */
    outboundTransform(topicStr: string, data: Uint8Array): Uint8Array;
}
//# sourceMappingURL=encoding.d.ts.map