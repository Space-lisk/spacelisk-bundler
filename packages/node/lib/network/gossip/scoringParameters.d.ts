import { PeerScoreParams, PeerScoreThresholds } from "@chainsafe/libp2p-gossipsub/score";
export declare const ATTESTATION_SUBNET_COUNT = 64;
export declare const SLOTS_PER_EPOCH = 8;
export declare const TARGET_AGGREGATORS_PER_COMMITTEE = 16;
export declare const GOSSIP_D = 8;
export declare const GOSSIP_D_LOW = 6;
export declare const GOSSIP_D_HIGH = 12;
/**
 * The following params is implemented by Lighthouse at
 * https://github.com/sigp/lighthouse/blob/b0ac3464ca5fb1e9d75060b56c83bfaf990a3d25/beacon_node/eth2_libp2p/src/behaviour/gossipsub_scoring_parameters.rs#L83
 */
export declare const gossipScoreThresholds: PeerScoreThresholds;
/**
 * Peer may sometimes has negative gossipsub score and we give it time to recover, however gossipsub score comes below this we need to take into account.
 * Given gossipsubThresold = -4000, it's comfortable to only ignore negative score gossip peer score > -1000
 */
export declare const negativeGossipScoreIgnoreThreshold = -1000;
/**
 * Explanation of each param https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.1.md#peer-scoring
 */
export declare function computeGossipPeerScoreParams({ config, }: any): Partial<PeerScoreParams>;
//# sourceMappingURL=scoringParameters.d.ts.map