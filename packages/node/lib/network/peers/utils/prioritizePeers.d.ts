import { PeerId } from "@libp2p/interface-peer-id";
import { Direction } from "@libp2p/interface-connection";
type PeerInfo = {
    id: PeerId;
    direction: Direction | null;
    score: number;
};
export interface PrioritizePeersOpts {
    targetPeers: number;
    maxPeers: number;
    outboundPeersRatio?: number;
}
export declare enum ExcessPeerDisconnectReason {
    LOW_SCORE = "low_score",
    NO_LONG_LIVED = "no_long_lived",
    FIND_BETTER_PEERS = "find_better_peers"
}
/**
 * Prioritize which peers to disconect and which to connect. Conditions:
 * - Reach `targetPeers`
 * - Don't exceed `maxPeers`
 * - Ensure there are enough peers
 * - Prioritize peers with good score
 */
export declare function prioritizePeers(connectedPeersInfo: {
    id: PeerId;
    direction: Direction | null;
    score: number;
}[], opts: PrioritizePeersOpts): {
    peersToConnect: number;
    peersToDisconnect: Map<ExcessPeerDisconnectReason, PeerId[]>;
};
/**
 * Sort peers ascending, peer-0 has the most chance to prune, peer-n has the least.
 * Shuffling first to break ties.
 */
export declare function sortPeersToPrune(connectedPeers: PeerInfo[]): PeerInfo[];
export {};
//# sourceMappingURL=prioritizePeers.d.ts.map