import * as reqRespProtocols from "../../reqresp/protocols/index.js";
import { NetworkEvent } from "../events.js";
import { Encoding } from "../peers/peersData.js";
import { PeerAction } from "../peers/score.js";
// import { ReqRespHandlers } from "./handlers.js";
import { ReqResp } from "../../reqresp/ReqResp.js";
import { EncodedPayloadType, } from "../../reqresp/types.js";
import { collectExactOne } from "../../reqresp/utils/index.js";
import { onOutgoingReqRespError } from "./score.js";
import { ReqRespMethod, Version } from "./types.js";
export class ReqRespNode extends ReqResp {
    constructor(modules, options = {}) {
        const { reqRespHandlers, networkEventBus, peersData, peerRpcScores, metadata, logger, metrics, } = modules;
        super({
            ...modules,
        }, {
            ...options,
            onRateLimit(peerId) {
                logger.debug("Do not serve request due to rate limit", {
                    peerId: peerId.toString(),
                });
                peerRpcScores.applyAction(peerId, PeerAction.Fatal, "rate_limit_rpc");
            },
            getPeerLogMetadata(peerId) {
                return peersData.getPeerKind(peerId);
            },
        });
        this.reqRespHandlers = reqRespHandlers;
        this.peerRpcScores = peerRpcScores;
        this.peersData = peersData;
        this.logger = logger;
        this.metadataController = metadata;
        this.networkEventBus = networkEventBus;
        this.metrics = metrics;
    }
    async start() {
        await super.start();
    }
    async stop() {
        await super.stop();
    }
    // NOTE: Do not pruneOnPeerDisconnect. Persist peer rate limit data until pruned by time
    // pruneOnPeerDisconnect(peerId: PeerId): void {
    //   this.rateLimiter.prune(peerId);
    registerProtocols() {
        const mustSubscribeProtocols = this.getProtocols();
        const mustSubscribeProtocolIDs = new Set(mustSubscribeProtocols.map((protocol) => this.formatProtocolID(protocol)));
        // Un-subscribe not required protocols
        for (const protocolID of this.getRegisteredProtocols()) {
            if (!mustSubscribeProtocolIDs.has(protocolID)) {
                // Async because of writing to peerstore -_- should never throw
                this.unregisterProtocol(protocolID).catch((e) => {
                    this.logger.error({ protocolID, e }, "Error on ReqResp.unregisterProtocol");
                });
            }
        }
        // Subscribe required protocols, prevent libp2p for throwing if already registered
        for (const protocol of mustSubscribeProtocols) {
            this.registerProtocol(protocol, { ignoreIfDuplicate: true }).catch((e) => {
                this.logger.error({ protocolID: this.formatProtocolID(protocol), e }, "Error on ReqResp.registerProtocol");
            });
        }
    }
    async status(peerId, request) {
        return collectExactOne(this.sendRequest(peerId, ReqRespMethod.Status, [Version.V1], request));
    }
    async goodbye(peerId, request) {
        await collectExactOne(this.sendRequest(peerId, ReqRespMethod.Goodbye, [Version.V1], request));
    }
    async ping(peerId) {
        return collectExactOne(this.sendRequest(peerId, ReqRespMethod.Ping, [Version.V1], this.metadataController.seq_number));
    }
    async metadata(peerId) {
        return collectExactOne(this.sendRequest(peerId, ReqRespMethod.Metadata, [Version.V1], null));
    }
    async pooledUserOpHashes(peerId, req) {
        return collectExactOne(this.sendRequest(peerId, ReqRespMethod.PooledUserOpHashes, [Version.V1], req));
    }
    async pooledUserOpsByHash(peerId, req) {
        return collectExactOne(this.sendRequest(peerId, ReqRespMethod.PooledUserOpsByHash, [Version.V1], req));
    }
    sendRequest(peerId, method, versions, body) {
        var _a;
        // Remember preferred encoding
        const encoding = (_a = this.peersData.getEncodingPreference(peerId.toString())) !== null && _a !== void 0 ? _a : Encoding.SSZ_SNAPPY;
        return super.sendRequest(peerId, method, versions, encoding, body);
    }
    onIncomingRequestBody(req, peerId) {
        setTimeout(() => this.networkEventBus.emit(NetworkEvent.reqRespRequest, req, peerId), 0);
    }
    onIncomingRequest(peerId, protocol) {
        if (protocol.method === ReqRespMethod.Status) {
            this.peersData.setEncodingPreference(peerId.toString(), protocol.encoding);
        }
    }
    onOutgoingRequestError(peerId, method, error) {
        const peerAction = onOutgoingReqRespError(error, method);
        if (peerAction !== null) {
            this.peerRpcScores.applyAction(peerId, peerAction, error.type.code);
        }
    }
    async *onStatus(req, peerId) {
        this.onIncomingRequestBody({ method: ReqRespMethod.Status, body: req }, peerId);
        yield* this.reqRespHandlers.onStatus();
    }
    async *onGoodbye(req, peerId) {
        this.onIncomingRequestBody({ method: ReqRespMethod.Goodbye, body: req }, peerId);
        yield { type: EncodedPayloadType.ssz, data: BigInt(0) };
    }
    async *onPing(req, peerId) {
        this.onIncomingRequestBody({ method: ReqRespMethod.Ping, body: req }, peerId);
        yield {
            type: EncodedPayloadType.ssz,
            data: this.metadataController.seq_number,
        };
    }
    async *onMetadata(req, peerId) {
        this.onIncomingRequestBody({ method: ReqRespMethod.Metadata, body: req }, peerId);
        yield { type: EncodedPayloadType.ssz, data: this.metadataController.json };
    }
    async *onPooledUserOpHashes(req, peerId) {
        this.onIncomingRequestBody({ method: ReqRespMethod.PooledUserOpHashes, body: req }, peerId);
        yield* this.reqRespHandlers.onPooledUserOpHashes(req, peerId);
    }
    async *onPooledUserOpsByHash(req, peerId) {
        this.onIncomingRequestBody({ method: ReqRespMethod.PooledUserOpsByHash, body: req }, peerId);
        yield* this.reqRespHandlers.onPooledUserOpsByHash(req, peerId);
    }
    getProtocols() {
        const modules = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const protocols = [
            reqRespProtocols.Ping(this.onPing.bind(this)),
            reqRespProtocols.Status(modules, this.onStatus.bind(this)),
            reqRespProtocols.Goodbye(modules, this.onGoodbye.bind(this)),
            reqRespProtocols.Metadata(modules, this.onMetadata.bind(this)),
            reqRespProtocols.PooledUserOpHashes(modules, this.onPooledUserOpHashes.bind(this)),
            reqRespProtocols.PooledUserOpsByHash(modules, this.onPooledUserOpsByHash.bind(this)),
        ];
        return protocols;
    }
}
//# sourceMappingURL=ReqRespNode.js.map