import { ssz } from "../../../types/lib/index.js";
import logger from "../../../api/lib/logger.js";
import { serializeMempoolId } from "../../../params/lib/index.js";
import { getConnectionsMap } from "../utils/index.js";
import { NetworkEventBus } from "./events.js";
import { MetadataController } from "./metadata.js";
import { createNodeJsLibp2p } from "./nodejs/index.js";
import { BundlerGossipsub } from "./gossip/index.js";
import { ReqRespNode } from "./reqresp/ReqRespNode.js";
import { PeerRpcScoreStore } from "./peers/score.js";
import { PeersData } from "./peers/peersData.js";
import { getReqRespHandlers } from "./reqresp/handlers/index.js";
import { PeerManager } from "./peers/peerManager.js";
import { getCoreTopics } from "./gossip/topic.js";
import { NetworkProcessor } from "./processor/index.js";
import { pooledUserOpHashes, pooledUserOpsByHash } from "./reqresp/index.js";
import { LocalStatusCache } from "./statusCache.js";
export class Network {
    constructor(opts) {
        this.closed = false;
        this.subscribedMempools = new Set();
        const { libp2p, reqResp, gossip, peerManager, metadata, events, peerId, networkProcessor, relayersConfig, executor, metrics, } = opts;
        this.libp2p = libp2p;
        this.reqResp = reqResp;
        this.gossip = gossip;
        this.peerManager = peerManager;
        this.logger = logger;
        this.metadata = metadata;
        this.events = events;
        this.peerId = peerId;
        this.networkProcessor = networkProcessor;
        this.relayersConfig = relayersConfig;
        this.executor = executor;
        this.metrics = metrics;
        this.logger.info("Initialised the bundler node module", "node");
    }
    static async init(options) {
        const { peerId, relayersConfig, executor, metrics } = options;
        const libp2p = await createNodeJsLibp2p(peerId, options.opts, {
            peerStoreDir: options.peerStoreDir,
        });
        const peersData = new PeersData();
        const peerRpcScores = new PeerRpcScoreStore();
        const networkEventBus = new NetworkEventBus();
        const gossip = new BundlerGossipsub({
            libp2p,
            events: networkEventBus,
            metrics,
        });
        const chainId = relayersConfig.chainId;
        const defaultMetadata = ssz.Metadata.defaultValue();
        const canonicalMempool = relayersConfig.getCanonicalMempool();
        if (canonicalMempool.mempoolId) {
            defaultMetadata.supported_mempools.push(serializeMempoolId(canonicalMempool.mempoolId));
        }
        const metadata = new MetadataController({
            chainId,
            metadata: defaultMetadata,
        });
        const reqRespHandlers = getReqRespHandlers(executor, relayersConfig, metrics);
        const reqResp = new ReqRespNode({
            libp2p,
            peersData,
            logger,
            reqRespHandlers,
            metadata,
            peerRpcScores,
            networkEventBus,
            metrics,
        });
        const networkProcessor = new NetworkProcessor({ events: networkEventBus, relayersConfig, executor, metrics }, {});
        const statusCache = new LocalStatusCache(reqRespHandlers, {
            chain_id: BigInt(chainId),
            block_hash: new Uint8Array(),
            block_number: BigInt(0)
        });
        const peerManagerModules = {
            libp2p,
            reqResp,
            gossip,
            logger,
            peerRpcScores,
            networkEventBus,
            peersData,
            statusCache,
        };
        const peerManager = new PeerManager(peerManagerModules, {
            ...options.opts,
            chainId
        });
        return new Network({
            libp2p,
            gossip,
            reqResp,
            peerManager,
            metadata,
            events: networkEventBus,
            peerId,
            networkProcessor,
            relayersConfig,
            executor,
            metrics,
        });
    }
    /** Shutdown the bundler node */
    close() {
        //switch off all event subscriptions.
    }
    /** Start bundler node */
    async start() {
        var _a;
        //start all services in an order
        await this.libp2p.start();
        await this.reqResp.start();
        this.reqResp.registerProtocols();
        await this.peerManager.start();
        const discv5 = (_a = this.peerManager["discovery"]) === null || _a === void 0 ? void 0 : _a.discv5;
        if (!discv5) {
            throw new Error("Discv5 not initialized");
        }
        const setEnrValue = discv5 === null || discv5 === void 0 ? void 0 : discv5.setEnrValue.bind(discv5);
        this.metadata.start(setEnrValue);
        await this.gossip.start();
        const multiaddresses = this.libp2p
            .getMultiaddrs()
            .map((m) => m.toString())
            .join(",");
        this.logger.info(`PeerId ${this.libp2p.peerId.toString()}, Multiaddrs ${multiaddresses}`);
        const enr = await this.getEnr();
        const canonicalMempool = this.relayersConfig.getCanonicalMempool();
        if (canonicalMempool.mempoolId) {
            this.subscribeGossipCoreTopics(canonicalMempool.mempoolId);
        }
        if (enr) {
            this.logger.info(`ENR: ${enr.encodeTxt()}`);
        }
        else {
            this.logger.error("Enr not accessible");
        }
    }
    /** Stop the bundler service node */
    async stop() {
        if (this.closed)
            return;
        await this.peerManager.goodbyeAndDisconnectAllPeers();
        await this.peerManager.stop();
        await this.gossip.stop();
        await this.reqResp.stop();
        await this.reqResp.unregisterAllProtocols();
        await this.libp2p.stop();
        this.closed = true;
    }
    async getEnr() {
        var _a;
        return (_a = this.peerManager["discovery"]) === null || _a === void 0 ? void 0 : _a.discv5.enr();
    }
    async getMetadata() {
        return {
            seq_number: this.metadata.seq_number,
            supported_mempools: this.metadata.supported_mempools,
        };
    }
    get discv5() {
        var _a;
        return (_a = this.peerManager["discovery"]) === null || _a === void 0 ? void 0 : _a.discv5;
    }
    get localMultiaddrs() {
        return this.libp2p.getMultiaddrs();
    }
    getConnectionsByPeer() {
        return getConnectionsMap(this.libp2p.connectionManager);
    }
    getConnectedPeers() {
        return this.peerManager.getConnectedPeerIds();
    }
    getConnectedPeerCount() {
        return this.peerManager.getConnectedPeerIds().length;
    }
    /* List of p2p functions supported by Bundler */
    async publishVerifiedUserOperation(userOp, mempool) {
        await this.gossip.publishVerifiedUserOperation(userOp, mempool);
    }
    async pooledUserOpHashes(peerId, req) {
        return await pooledUserOpHashes(this.reqResp, peerId, this.executor, this.relayersConfig, req);
    }
    async pooledUserOpsByHash(peerId, req) {
        return await pooledUserOpsByHash(this.reqResp, peerId, this.executor, this.relayersConfig, req);
    }
    //Gossip handler
    subscribeGossipCoreTopics(mempool) {
        if (this.subscribedMempools.has(mempool))
            return;
        this.subscribedMempools.add(mempool);
        for (const topic of getCoreTopics()) {
            this.gossip.subscribeTopic({ ...topic, mempool });
        }
    }
    unsubscribeGossipCoreTopics(mempool) {
        if (this.subscribedMempools.has(mempool))
            return;
        this.subscribedMempools.delete(mempool);
        for (const topic of getCoreTopics()) {
            this.gossip.unsubscribeTopic({ ...topic, mempool });
        }
    }
    isSubscribedToGossipCoreTopics(mempool) {
        return this.subscribedMempools.has(mempool);
    }
    // Debug
    async connectToPeer(peer, multiaddr) {
        await this.libp2p.peerStore.addressBook.add(peer, multiaddr);
        await this.libp2p.dial(peer);
    }
    async disconnectPeer(peer) {
        await this.libp2p.hangUp(peer);
    }
    getAgentVersion(_peerIdStr) {
        return "";
    }
}
//# sourceMappingURL=network.js.map