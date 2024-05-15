import { PeerMap } from "../utils";
import { ISyncService, PeerState, SyncModules, SyncState } from "./interface";
export declare class SyncService implements ISyncService {
    state: SyncState;
    peers: PeerMap<PeerState>;
    private readonly network;
    private readonly metrics;
    private readonly executor;
    private readonly executorConfig;
    constructor(modules: SyncModules);
    close(): void;
    isSyncing(): boolean;
    isSynced(): boolean;
    private addPeer;
    private addPeerMetadata;
    /**
     * Must be called by libp2p when a peer is removed from the peer manager
     */
    private removePeer;
    private startSyncing;
    private requestBatches;
}
//# sourceMappingURL=sync.d.ts.map