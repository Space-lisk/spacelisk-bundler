import { GoodByeReasonCode, GOODBYE_KNOWN_CODES, Libp2pEvent, } from "../../constants/index.js";
import { NetworkEvent } from "../events.js";
import { getConnection, prettyPrintPeerId } from "../../utils/network.js";
import { ReqRespMethod } from "../reqresp/index.js";
import { PeerDiscovery } from "./discover.js";
import { ScoreState, updateGossipsubScores } from "./score.js";
import { clientFromAgentVersion } from "./client.js";
import { getConnectedPeerIds, hasSomeConnectedPeer, prioritizePeers, } from "./utils/index.js";
/** heartbeat performs regular updates such as updating reputations and performing discovery requests */
const HEARTBEAT_INTERVAL_MS = 15 * 1000;
/** The time in seconds between PING events. We do not send a ping if the other peer has PING'd us */
const PING_INTERVAL_INBOUND_MS = 15 * 1000; // Offset to not ping when outbound reqs
const PING_INTERVAL_OUTBOUND_MS = 20 * 1000;
/** The time in seconds between re-status's peers. */
const STATUS_INTERVAL_MS = 5 * 60 * 1000;
/** Expect a STATUS request from on inbound peer for some time. Afterwards the node does a request */
const STATUS_INBOUND_GRACE_PERIOD = 15 * 1000;
/** Internal interval to check PING and STATUS timeouts */
const CHECK_PING_STATUS_INTERVAL = 10 * 1000;
/** A peer is considered long connection if it's >= 1 day */
// const LONG_PEER_CONNECTION_MS = 24 * 60 * 60 * 1000;
const PEER_RELEVANT_TAG = "relevant";
/** Tag value of PEER_RELEVANT_TAG */
const PEER_RELEVANT_TAG_VALUE = 100;
const ALLOWED_NEGATIVE_GOSSIPSUB_FACTOR = 0.1;
var RelevantPeerStatus;
(function (RelevantPeerStatus) {
    RelevantPeerStatus["Unknown"] = "unknown";
    RelevantPeerStatus["relevant"] = "relevant";
    RelevantPeerStatus["irrelevant"] = "irrelevant";
})(RelevantPeerStatus || (RelevantPeerStatus = {}));
/**
 * Performs all peer management functionality in a single grouped class:
 * - Ping peers every `PING_INTERVAL_MS`
 * - Status peers every `STATUS_INTERVAL_MS`
 * - Execute discovery query if under target peers
 * - Disconnect peers if over target peers
 */
export class PeerManager {
    constructor(modules, opts) {
        var _a;
        this.intervals = [];
        /**
         * Must be called when network ReqResp receives incoming requests
         */
        this.onRequest = (request, peer) => {
            try {
                const peerData = this.connectedPeers.get(peer.toString());
                if (peerData) {
                    peerData.lastReceivedMsgUnixTsMs = Date.now();
                }
                switch (request.method) {
                    case ReqRespMethod.Ping:
                        return this.onPing(peer, request.body);
                    case ReqRespMethod.Goodbye:
                        return this.onGoodbye(peer, request.body);
                    case ReqRespMethod.Status:
                        return this.onStatus(peer, request.body);
                }
            }
            catch (e) {
                this.logger.error({ e: e, method: request.method }, "Error onRequest handler");
            }
        };
        /**
         * The libp2p Upgrader has successfully upgraded a peer connection on a particular multiaddress
         * This event is routed through the connectionManager
         *
         * Registers a peer as connected. The `direction` parameter determines if the peer is being
         * dialed or connecting to us.
         */
        this.onLibp2pPeerConnect = async (evt) => {
            const libp2pConnection = evt.detail;
            const { direction, status } = libp2pConnection.stat;
            const peer = libp2pConnection.remotePeer;
            this.logger.debug({
                peer: prettyPrintPeerId(peer),
                direction,
                status,
            }, "peer connected");
            // libp2p may emit closed connection, we don't want to handle it
            // see https://github.com/libp2p/js-libp2p/issues/1565
            if (this.connectedPeers.has(peer.toString()) || status !== "OPEN") {
                return;
            }
            // On connection:
            // - Outbound connections: send a STATUS and PING request
            // - Inbound connections: expect to be STATUS'd, schedule STATUS and PING for latter
            // NOTE: libp2p may emit two "peer:connect" events: One for inbound, one for outbound
            // If that happens, it's okay. Only the "outbound" connection triggers immediate action
            const now = Date.now();
            const peerData = {
                lastReceivedMsgUnixTsMs: direction === "outbound" ? 0 : now,
                // If inbound, request after STATUS_INBOUND_GRACE_PERIOD
                lastStatusUnixTsMs: direction === "outbound"
                    ? 0
                    : now - STATUS_INTERVAL_MS + STATUS_INBOUND_GRACE_PERIOD,
                connectedUnixTsMs: now,
                relevantStatus: RelevantPeerStatus.Unknown,
                direction,
                peerId: peer,
                metadata: null,
                agentVersion: null,
                agentClient: null,
                encodingPreference: null,
            };
            this.connectedPeers.set(peer.toString(), peerData);
            const localStatus = await this.statusCache.get();
            if (direction === "outbound") {
                void this.requestPing(peer);
                void this.requestStatus(peer, localStatus);
            }
            // AgentVersion was set in libp2p IdentifyService, 'peer:connect' event handler
            // since it's not possible to handle it async, we have to wait for a while to set AgentVersion
            // See https://github.com/libp2p/js-libp2p/pull/1168
            setTimeout(async () => {
                const agentVersionBytes = await this.libp2p.peerStore.metadataBook.getValue(peerData.peerId, "AgentVersion");
                if (agentVersionBytes) {
                    const agentVersion = new TextDecoder().decode(agentVersionBytes) || "N/A";
                    peerData.agentVersion = agentVersion;
                    peerData.agentClient = clientFromAgentVersion(agentVersion);
                }
            }, 1000);
        };
        /**
         * The libp2p Upgrader has ended a connection
         */
        this.onLibp2pPeerDisconnect = (evt) => {
            const libp2pConnection = evt.detail;
            const { direction, status } = libp2pConnection.stat;
            const peer = libp2pConnection.remotePeer;
            // remove the ping and status timer for the peer
            this.connectedPeers.delete(peer.toString());
            this.logger.debug({
                peer: prettyPrintPeerId(peer),
                direction,
                status,
            }, "peer disconnected");
            this.networkEventBus.emit(NetworkEvent.peerDisconnected, peer);
            this.libp2p.peerStore
                .unTagPeer(peer, PEER_RELEVANT_TAG)
                .catch((e) => this.logger.debug("cannot untag peer", { peerId: peer.toString() }, e));
        };
        this.libp2p = modules.libp2p;
        this.logger = modules.logger;
        this.reqResp = modules.reqResp;
        this.gossipsub = modules.gossip;
        this.peerRpcScores = modules.peerRpcScores;
        this.networkEventBus = modules.networkEventBus;
        this.connectedPeers = modules.peersData.connectedPeers;
        this.statusCache = modules.statusCache;
        this.opts = opts;
        // opts.discv5 === null, discovery is disabled
        this.discovery =
            (_a = modules.discovery) !== null && _a !== void 0 ? _a : (opts.discv5 &&
                new PeerDiscovery(modules, {
                    maxPeers: opts.maxPeers,
                    discv5FirstQueryDelayMs: opts.discv5FirstQueryDelayMs,
                    discv5: opts.discv5,
                    connectToDiscv5Bootnodes: opts.connectToDiscv5Bootnodes,
                    chainId: opts.chainId,
                }));
    }
    async start() {
        var _a;
        await ((_a = this.discovery) === null || _a === void 0 ? void 0 : _a.start());
        this.libp2p.connectionManager.addEventListener(Libp2pEvent.peerConnect, this.onLibp2pPeerConnect);
        this.libp2p.connectionManager.addEventListener(Libp2pEvent.peerDisconnect, this.onLibp2pPeerDisconnect);
        this.networkEventBus.on(NetworkEvent.reqRespRequest, this.onRequest);
        // On start-up will connected to existing peers in libp2p.peerStore, same as autoDial behaviour
        this.heartbeat();
        this.intervals = [
            setInterval(this.pingAndStatusTimeouts.bind(this), CHECK_PING_STATUS_INTERVAL),
            setInterval(this.heartbeat.bind(this), HEARTBEAT_INTERVAL_MS),
            setInterval(this.updateGossipsubScores.bind(this), HEARTBEAT_INTERVAL_MS),
        ];
    }
    async stop() {
        var _a;
        await ((_a = this.discovery) === null || _a === void 0 ? void 0 : _a.stop());
        this.libp2p.connectionManager.removeEventListener(Libp2pEvent.peerConnect, this.onLibp2pPeerConnect);
        this.libp2p.connectionManager.removeEventListener(Libp2pEvent.peerDisconnect, this.onLibp2pPeerDisconnect);
        this.networkEventBus.off(NetworkEvent.reqRespRequest, this.onRequest);
        for (const interval of this.intervals)
            clearInterval(interval);
    }
    /**
     * Return peers with at least one connection in status "open"
     */
    getConnectedPeerIds() {
        return getConnectedPeerIds(this.libp2p);
    }
    /**
     * Efficiently check if there is at least one peer connected
     */
    hasSomeConnectedPeer() {
        return hasSomeConnectedPeer(this.libp2p);
    }
    async goodbyeAndDisconnectAllPeers() {
        await Promise.all(
        // Filter by peers that support the goodbye protocol: {supportsProtocols: [goodbyeProtocol]}
        this.getConnectedPeerIds().map(async (peer) => this.goodbyeAndDisconnect(peer, GoodByeReasonCode.CLIENT_SHUTDOWN)));
    }
    /**
     * The app layer needs to refresh the status of some peers. The sync have reached a target
     */
    reStatusPeers(peers) {
        for (const peer of peers) {
            const peerData = this.connectedPeers.get(peer.toString());
            if (peerData) {
                // Set to 0 to trigger a status request after calling pingAndStatusTimeouts()
                peerData.lastStatusUnixTsMs = 0;
            }
        }
        this.pingAndStatusTimeouts();
    }
    /**
     * Handle a PING request + response (rpc handler responds with PONG automatically)
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onPing(peer, seqNumber) {
        var _a;
        // if the sequence number is unknown update the peer's metadata
        const metadata = (_a = this.connectedPeers.get(peer.toString())) === null || _a === void 0 ? void 0 : _a.metadata;
        if (!metadata || metadata.seq_number < seqNumber) {
            void this.requestMetadata(peer);
        }
    }
    /**
     * Handle a METADATA request + response (rpc handler responds with METADATA automatically)
     */
    onMetadata(peer, metadata) {
        const peerData = this.connectedPeers.get(peer.toString());
        if (peerData) {
            peerData.metadata = {
                seq_number: metadata.seq_number,
                supported_mempools: metadata.supported_mempools,
            };
            this.logger.debug(`Received metadata from ${peer.toString()}`);
            this.networkEventBus.emit(NetworkEvent.peerMetadataReceived, peer, metadata);
        }
        else {
            this.logger.error(`Could not parse metadata from ${peer.toString()}`);
        }
    }
    /**
     * Handle a GOODBYE request (rpc handler responds automatically)
     */
    onGoodbye(peer, goodbye) {
        const reason = GOODBYE_KNOWN_CODES[goodbye.toString()] || "";
        this.logger.debug({
            peer: prettyPrintPeerId(peer),
            goodbye,
            reason,
        }, "Received goodbye request");
        void this.disconnect(peer);
    }
    /**
     * Handle a STATUS request + response (rpc handler responds with STATUS automatically)
     */
    onStatus(peer, status) {
        // reset the to-status timer of this peer
        const peerData = this.connectedPeers.get(peer.toString());
        if (peerData)
            peerData.lastStatusUnixTsMs = Date.now();
        // Peer is usable, send it to the rangeSync
        // NOTE: Peer may not be connected anymore at this point, potential race condition
        // libp2p.connectionManager.get() returns not null if there's +1 open connections with `peer`
        if (peerData && peerData.relevantStatus !== RelevantPeerStatus.relevant) {
            this.libp2p.peerStore
                // ttl = undefined means it's never expired
                .tagPeer(peer, PEER_RELEVANT_TAG, {
                ttl: undefined,
                value: PEER_RELEVANT_TAG_VALUE,
            })
                .catch((e) => this.logger.debug("cannot tag peer", { peerId: peer.toString() }, e));
            peerData.relevantStatus = RelevantPeerStatus.relevant;
        }
        if (getConnection(this.libp2p.connectionManager, peer.toString())) {
            this.logger.debug(`Peer connected: ${peer.toString()}`);
            this.networkEventBus.emit(NetworkEvent.peerConnected, peer, status);
        }
    }
    async requestMetadata(peer) {
        try {
            this.onMetadata(peer, await this.reqResp.metadata(peer));
        }
        catch (e) {
            // TODO: Downvote peer here or in the reqResp layer
        }
    }
    async requestPing(peer) {
        try {
            this.onPing(peer, await this.reqResp.ping(peer));
            // If peer replies a PING request also update lastReceivedMsg
            const peerData = this.connectedPeers.get(peer.toString());
            if (peerData)
                peerData.lastReceivedMsgUnixTsMs = Date.now();
        }
        catch (e) {
            // TODO: Downvote peer here or in the reqResp layer
        }
    }
    async requestStatus(peer, localStatus) {
        try {
            this.onStatus(peer, await this.reqResp.status(peer, localStatus));
        }
        catch (e) {
            // TODO: Failed to get peer latest status: downvote but don't disconnect
        }
    }
    /**
     * The Peer manager's heartbeat maintains the peer count and maintains peer reputations.
     * It will request discovery queries if the peer count has not reached the desired number of peers.
     * NOTE: Discovery should only add a new query if one isn't already queued.
     */
    heartbeat() {
        const connectedPeers = this.getConnectedPeerIds();
        // Decay scores before reading them. Also prunes scores
        this.peerRpcScores.update();
        // ban and disconnect peers with bad score, collect rest of healthy peers
        const connectedHealthyPeers = [];
        for (const peer of connectedPeers) {
            switch (this.peerRpcScores.getScoreState(peer)) {
                case ScoreState.Banned:
                    void this.goodbyeAndDisconnect(peer, GoodByeReasonCode.BANNED);
                    break;
                case ScoreState.Disconnected:
                    void this.goodbyeAndDisconnect(peer, GoodByeReasonCode.SCORE_TOO_LOW);
                    break;
                case ScoreState.Healthy:
                    connectedHealthyPeers.push(peer);
            }
        }
        const { peersToDisconnect, peersToConnect } = prioritizePeers(connectedHealthyPeers.map((peer) => {
            var _a;
            const peerData = this.connectedPeers.get(peer.toString());
            return {
                id: peer,
                direction: (_a = peerData === null || peerData === void 0 ? void 0 : peerData.direction) !== null && _a !== void 0 ? _a : null,
                score: this.peerRpcScores.getScore(peer),
            };
        }), this.opts);
        this.logger.debug(connectedHealthyPeers, `peersToConnect: ${peersToConnect}`);
        // disconnect first to have more slots before we dial new peers
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [reason, peers] of peersToDisconnect) {
            for (const peer of peers) {
                void this.goodbyeAndDisconnect(peer, GoodByeReasonCode.TOO_MANY_PEERS);
            }
        }
        if (this.discovery) {
            this.logger.debug("Discovering peers...");
            try {
                this.discovery.discoverPeers(peersToConnect);
            }
            catch (e) {
                this.logger.error("Error on discoverPeers", {}, e);
            }
        }
        // Prune connectedPeers map in case it leaks. It has happen in previous nodes,
        // disconnect is not always called for all peers
        if (this.connectedPeers.size > connectedPeers.length * 2) {
            const actualConnectedPeerIds = new Set(connectedPeers.map((peerId) => peerId.toString()));
            for (const peerIdStr of this.connectedPeers.keys()) {
                if (!actualConnectedPeerIds.has(peerIdStr)) {
                    this.connectedPeers.delete(peerIdStr);
                }
            }
        }
    }
    updateGossipsubScores() {
        const gossipsubScores = new Map();
        for (const peerIdStr of this.connectedPeers.keys()) {
            gossipsubScores.set(peerIdStr, this.gossipsub.getScore(peerIdStr));
        }
        const toIgnoreNegativePeers = Math.ceil(this.opts.targetPeers * ALLOWED_NEGATIVE_GOSSIPSUB_FACTOR);
        updateGossipsubScores(this.peerRpcScores, gossipsubScores, toIgnoreNegativePeers);
    }
    pingAndStatusTimeouts() {
        const now = Date.now();
        const peersToStatus = [];
        for (const peer of this.connectedPeers.values()) {
            // Every interval request to send some peers our seqNumber and process theirs
            // If the seqNumber is different it must request the new metadata
            const pingInterval = peer.direction === "inbound"
                ? PING_INTERVAL_INBOUND_MS
                : PING_INTERVAL_OUTBOUND_MS;
            if (now > peer.lastReceivedMsgUnixTsMs + pingInterval) {
                void this.requestPing(peer.peerId);
            }
            // TODO: Consider sending status request to peers that do support status protocol
            // {supportsProtocols: getStatusProtocols()}
            // Every interval request to send some peers our status, and process theirs
            // Must re-check if this peer is relevant to us and emit an event if the status changes
            // So the sync layer can update things
            if (now > peer.lastStatusUnixTsMs + STATUS_INTERVAL_MS) {
                peersToStatus.push(peer.peerId);
            }
        }
        // if (peersToStatus.length > 0) {
        //   void this.requestStatusMany(peersToStatus);
        // }
    }
    async disconnect(peer) {
        try {
            await this.libp2p.hangUp(peer);
        }
        catch (e) {
            this.logger.warn("Unclean disconnect", { peer: prettyPrintPeerId(peer) }, e);
        }
    }
    async goodbyeAndDisconnect(peer, goodbye) {
        try {
            await this.reqResp.goodbye(peer, BigInt(goodbye));
        }
        catch (e) {
            this.logger.debug({ peer: prettyPrintPeerId(peer), error: e }, "Failed to send goodbye");
        }
        finally {
            void this.disconnect(peer);
        }
    }
}
//# sourceMappingURL=peerManager.js.map