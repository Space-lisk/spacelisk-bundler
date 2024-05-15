import { IDiscv5DiscoveryInputOptions } from "@chainsafe/discv5";
import Logger from "api/lib/logger";
import { Libp2p } from "../interface";
import { Discv5Worker } from "../discv5";
import { IPeerRpcScoreStore } from "./score";
export type PeerDiscoveryOpts = {
    maxPeers: number;
    discv5FirstQueryDelayMs: number;
    discv5: Omit<IDiscv5DiscoveryInputOptions, "metrics" | "searchInterval" | "enabled">;
    connectToDiscv5Bootnodes?: boolean;
    chainId: number;
};
export type PeerDiscoveryModules = {
    libp2p: Libp2p;
    peerRpcScores: IPeerRpcScoreStore;
    logger: typeof Logger;
};
type UnixMs = number;
export type DiscvQueryMs = {
    toUnixMs: UnixMs;
    maxPeersToDiscover: number;
};
/**
 * PeerDiscovery discovers and dials new peers, and executes discv5 queries.
 * Currently relies on discv5 automatic periodic queries.
 */
export declare class PeerDiscovery {
    readonly discv5: Discv5Worker;
    private libp2p;
    private peerRpcScores;
    private logger;
    private cachedENRs;
    private randomNodeQuery;
    private peersToConnect;
    private maxPeers;
    private discv5StartMs;
    private discv5FirstQueryDelayMs;
    private connectToDiscv5BootnodesOnStart;
    private chainId;
    constructor(modules: PeerDiscoveryModules, opts: PeerDiscoveryOpts);
    start(): Promise<void>;
    stop(): Promise<void>;
    /**
     * Request to find peers
     */
    discoverPeers(peersToConnect: number): void;
    /**
     * Request to find peers. First, looked at cached peers in peerStore
     */
    private runFindRandomNodeQuery;
    /**
     * Progressively called by libp2p peer discovery as a result of any query.
     */
    private onDiscoveredPeer;
    /**
     * Progressively called by discv5 as a result of any query.
     */
    private onDiscoveredENR;
    /**
     * Progressively called by peer discovery as a result of any query.
     */
    private handleDiscoveredPeer;
    private shouldDialPeer;
    /**
     * Handles DiscoveryEvent::QueryResult
     * Peers that have been returned by discovery requests are dialed here if they are suitable.
     */
    private dialPeer;
    /** Check if there is 1+ open connection with this peer */
    private isPeerConnected;
}
export {};
//# sourceMappingURL=discover.d.ts.map