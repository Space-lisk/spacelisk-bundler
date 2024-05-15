import { PeerId } from "@libp2p/interface-peer-id";
export declare enum PeerAction {
    /** Immediately ban peer */
    Fatal = "Fatal",
    /**
     * Not malicious action, but it must not be tolerated
     * ~5 occurrences will get the peer banned
     */
    LowToleranceError = "LowToleranceError",
    /**
     * Negative action that can be tolerated only sometimes
     * ~10 occurrences will get the peer banned
     */
    MidToleranceError = "MidToleranceError",
    /**
     * Some error that can be tolerated multiple times
     * ~50 occurrences will get the peer banned
     */
    HighToleranceError = "HighToleranceError"
}
export declare enum ScoreState {
    /** We are content with the peers performance. We permit connections and messages. */
    Healthy = "Healthy",
    /** The peer should be disconnected. We allow re-connections if the peer is persistent */
    Disconnected = "Disconnected",
    /** The peer is banned. We disallow new connections until it's score has decayed into a tolerable threshold */
    Banned = "Banned"
}
type PeerIdStr = string;
export interface IPeerRpcScoreStore {
    getScore(peer: PeerId): number;
    getGossipScore(peer: PeerId): number;
    getScoreState(peer: PeerId): ScoreState;
    dumpPeerScoreStats(): PeerScoreStats;
    applyAction(peer: PeerId, action: PeerAction, actionName: string): void;
    update(): void;
    updateGossipsubScore(peerId: PeerIdStr, newScore: number, ignore: boolean): void;
}
export type PeerRpcScoreStoreModules = {};
export type PeerScoreStats = ({
    peerId: PeerIdStr;
} & PeerScoreStat)[];
export type PeerScoreStat = {
    skandhaScore: number;
    gossipScore: number;
    ignoreNegativeGossipScore: boolean;
    score: number;
    lastUpdate: number;
};
/**
 * A peer's score (perceived potential usefulness).
 * This simplistic version consists of a global score per peer which decays to 0 over time.
 * The decay rate applies equally to positive and negative scores.
 */
export declare class PeerRpcScoreStore implements IPeerRpcScoreStore {
    private readonly scores;
    getScore(peer: PeerId): number;
    getGossipScore(peer: PeerId): number;
    getScoreState(peer: PeerId): ScoreState;
    dumpPeerScoreStats(): PeerScoreStats;
    applyAction(peer: PeerId, action: PeerAction): void;
    update(): void;
    updateGossipsubScore(peerId: PeerIdStr, newScore: number, ignore: boolean): void;
}
/**
 * Manage score of a peer.
 */
export declare class PeerScore {
    private skandhaScore;
    private gossipScore;
    private ignoreNegativeGossipScore;
    /** The final score, computed from the above */
    private score;
    private lastUpdate;
    constructor();
    getScore(): number;
    getGossipScore(): number;
    add(scoreDelta: number): void;
    /**
     * Applies time-based logic such as decay rates to the score.
     * This function should be called periodically.
     *
     * Return the new score.
     */
    update(): number;
    updateGossipsubScore(newScore: number, ignore: boolean): void;
    getStat(): PeerScoreStat;
    private setSkandhaScore;
    /**
     * Compute the final score, ban peer if needed
     */
    private updateState;
    /**
     * Compute the final score
     */
    private recomputeScore;
}
/**
 * Utility to update gossipsub score of connected peers
 */
export declare function updateGossipsubScores(peerRpcScores: IPeerRpcScoreStore, gossipsubScores: Map<string, number>, toIgnoreNegativePeers: number): void;
export {};
//# sourceMappingURL=score.d.ts.map