import { PeerId } from "@libp2p/interface-peer-id";
import { IDiscv5DiscoveryInputOptions } from "@chainsafe/discv5";
import Logger from "api/lib/logger";
import { INetworkEventBus } from "../events";
import { Libp2p } from "../interface";
import { BundlerGossipsub } from "../gossip/handler";
import { IReqRespNode } from "../reqresp/interface";
import { StatusCache } from "../statusCache";
import { PeersData } from "./peersData";
import { PeerDiscovery } from "./discover";
import { IPeerRpcScoreStore } from "./score";
export type PeerManagerOpts = {
    /** The target number of peers we would like to connect to. */
    targetPeers: number;
    /** The maximum number of peers we allow */
    maxPeers: number;
    discv5FirstQueryDelayMs: number;
    /**
     * If null, Don't run discv5 queries, nor connect to cached peers in the peerStore
     */
    discv5: IDiscv5DiscoveryInputOptions | null;
    /**
     * If set to true, connect to Discv5 bootnodes. If not set or false, do not connect
     */
    connectToDiscv5Bootnodes?: boolean;
    /** default chain id */
    chainId: number;
};
export type PeerManagerModules = {
    libp2p: Libp2p;
    logger: typeof Logger;
    reqResp: IReqRespNode;
    gossip: BundlerGossipsub;
    peerRpcScores: IPeerRpcScoreStore;
    networkEventBus: INetworkEventBus;
    peersData: PeersData;
    discovery?: PeerDiscovery;
    statusCache: StatusCache;
};
/**
 * Performs all peer management functionality in a single grouped class:
 * - Ping peers every `PING_INTERVAL_MS`
 * - Status peers every `STATUS_INTERVAL_MS`
 * - Execute discovery query if under target peers
 * - Disconnect peers if over target peers
 */
export declare class PeerManager {
    private libp2p;
    private logger;
    private reqResp;
    private gossipsub;
    private peerRpcScores;
    /** If null, discovery is disabled */
    private discovery;
    private networkEventBus;
    private connectedPeers;
    private statusCache;
    private opts;
    private intervals;
    constructor(modules: PeerManagerModules, opts: PeerManagerOpts);
    start(): Promise<void>;
    stop(): Promise<void>;
    /**
     * Return peers with at least one connection in status "open"
     */
    getConnectedPeerIds(): PeerId[];
    /**
     * Efficiently check if there is at least one peer connected
     */
    hasSomeConnectedPeer(): boolean;
    goodbyeAndDisconnectAllPeers(): Promise<void>;
    /**
     * The app layer needs to refresh the status of some peers. The sync have reached a target
     */
    reStatusPeers(peers: PeerId[]): void;
    /**
     * Must be called when network ReqResp receives incoming requests
     */
    private onRequest;
    /**
     * Handle a PING request + response (rpc handler responds with PONG automatically)
     */
    private onPing;
    /**
     * Handle a METADATA request + response (rpc handler responds with METADATA automatically)
     */
    private onMetadata;
    /**
     * Handle a GOODBYE request (rpc handler responds automatically)
     */
    private onGoodbye;
    /**
     * Handle a STATUS request + response (rpc handler responds with STATUS automatically)
     */
    private onStatus;
    private requestMetadata;
    private requestPing;
    private requestStatus;
    /**
     * The Peer manager's heartbeat maintains the peer count and maintains peer reputations.
     * It will request discovery queries if the peer count has not reached the desired number of peers.
     * NOTE: Discovery should only add a new query if one isn't already queued.
     */
    private heartbeat;
    private updateGossipsubScores;
    private pingAndStatusTimeouts;
    /**
     * The libp2p Upgrader has successfully upgraded a peer connection on a particular multiaddress
     * This event is routed through the connectionManager
     *
     * Registers a peer as connected. The `direction` parameter determines if the peer is being
     * dialed or connecting to us.
     */
    private onLibp2pPeerConnect;
    /**
     * The libp2p Upgrader has ended a connection
     */
    private onLibp2pPeerDisconnect;
    private disconnect;
    private goodbyeAndDisconnect;
}
//# sourceMappingURL=peerManager.d.ts.map