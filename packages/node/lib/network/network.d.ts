import { Connection } from "@libp2p/interface-connection";
import { Multiaddr } from "@multiformats/multiaddr";
import { PeerId } from "@libp2p/interface-peer-id";
import { ts } from "types/lib";
import { SignableENR } from "@chainsafe/discv5";
import { Logger } from "api/lib/logger";
import { Config } from "executor/lib/config";
import { AllChainsMetrics } from "monitoring/lib";
import { Executor } from "executor/lib/executor";
import { INetworkOptions } from "../options";
import { INetwork, Libp2p } from "./interface";
import { INetworkEventBus } from "./events";
import { MetadataController } from "./metadata";
import { BundlerGossipsub } from "./gossip";
import { ReqRespNode } from "./reqresp/ReqRespNode";
import { PeerManager } from "./peers/peerManager";
import { Discv5Worker } from "./discv5";
import { NetworkProcessor } from "./processor";
type NetworkModules = {
    libp2p: Libp2p;
    gossip: BundlerGossipsub;
    reqResp: ReqRespNode;
    peerManager: PeerManager;
    metadata: MetadataController;
    events: INetworkEventBus;
    peerId: PeerId;
    networkProcessor: NetworkProcessor;
    relayersConfig: Config;
    executor: Executor;
    metrics: AllChainsMetrics | null;
};
export type NetworkInitOptions = {
    opts: INetworkOptions;
    relayersConfig: Config;
    peerId: PeerId;
    executor: Executor;
    peerStoreDir?: string;
    metrics: AllChainsMetrics | null;
};
export declare class Network implements INetwork {
    closed: boolean;
    peerId: PeerId;
    logger: Logger;
    events: INetworkEventBus;
    metadata: MetadataController;
    gossip: BundlerGossipsub;
    reqResp: ReqRespNode;
    peerManager: PeerManager;
    libp2p: Libp2p;
    networkProcessor: NetworkProcessor;
    executor: Executor;
    metrics: AllChainsMetrics | null;
    relayersConfig: Config;
    subscribedMempools: Set<string>;
    constructor(opts: NetworkModules);
    static init(options: NetworkInitOptions): Promise<Network>;
    /** Shutdown the bundler node */
    close(): void;
    /** Start bundler node */
    start(): Promise<void>;
    /** Stop the bundler service node */
    stop(): Promise<void>;
    getEnr(): Promise<SignableENR | undefined>;
    getMetadata(): Promise<ts.Metadata>;
    get discv5(): Discv5Worker | undefined;
    get localMultiaddrs(): Multiaddr[];
    getConnectionsByPeer(): Map<string, Connection[]>;
    getConnectedPeers(): PeerId[];
    getConnectedPeerCount(): number;
    publishVerifiedUserOperation(userOp: ts.VerifiedUserOperation, mempool: string): Promise<void>;
    pooledUserOpHashes(peerId: PeerId, req: ts.PooledUserOpHashesRequest): Promise<ts.PooledUserOpHashes>;
    pooledUserOpsByHash(peerId: PeerId, req: ts.PooledUserOpsByHashRequest): Promise<ts.PooledUserOpsByHash>;
    subscribeGossipCoreTopics(mempool: string): void;
    unsubscribeGossipCoreTopics(mempool: string): void;
    isSubscribedToGossipCoreTopics(mempool: string): boolean;
    connectToPeer(peer: PeerId, multiaddr: Multiaddr[]): Promise<void>;
    disconnectPeer(peer: PeerId): Promise<void>;
    getAgentVersion(_peerIdStr: string): string;
}
export {};
//# sourceMappingURL=network.d.ts.map