import { setMaxListeners } from "node:events";
import { RequestError, sendRequest } from "./request/index.js";
import { handleRequest } from "./response/index.js";
import { ReqRespRateLimiter } from "./rate_limiter/ReqRespRateLimiter.js";
import { formatProtocolID } from "./utils/index.js";
export const DEFAULT_PROTOCOL_PREFIX = "/account_abstraction";
export class ReqResp {
    constructor(modules, opts = {}) {
        var _a;
        this.opts = opts;
        this.controller = new AbortController();
        /** Tracks request and responses in a sequential counter */
        this.reqCount = 0;
        /** `${protocolPrefix}/${method}/${version}/${encoding}` */
        // Use any to avoid TS error on registering protocol
        // Type 'unknown' is not assignable to type 'Resp'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.registeredProtocols = new Map();
        this.dialOnlyProtocols = new Map();
        this.libp2p = modules.libp2p;
        this.logger = modules.logger;
        this.protocolPrefix = (_a = opts.protocolPrefix) !== null && _a !== void 0 ? _a : DEFAULT_PROTOCOL_PREFIX;
        this.rateLimiter = new ReqRespRateLimiter(opts);
    }
    /**
     * Register protocol which will be used only to dial to other peers
     * The libp2p instance will not handle that protocol
     *
     * Made it explicit method to avoid any developer mistake
     */
    registerDialOnlyProtocol(protocol, opts) {
        const protocolID = this.formatProtocolID(protocol);
        // libp2p will throw on error on duplicates, allow to overwrite behavior
        if ((opts === null || opts === void 0 ? void 0 : opts.ignoreIfDuplicate) && this.registeredProtocols.has(protocolID)) {
            return;
        }
        this.registeredProtocols.set(protocolID, protocol);
        this.dialOnlyProtocols.set(protocolID, true);
    }
    /**
     * Register protocol as supported and to libp2p.
     * async because libp2p registar persists the new protocol list in the peer-store.
     * Throws if the same protocol is registered twice.
     * Can be called at any time, no concept of started / stopped
     */
    async registerProtocol(protocol, opts) {
        const protocolID = this.formatProtocolID(protocol);
        const { handler: _handler, renderRequestBody: _renderRequestBody, inboundRateLimits, ...rest } = protocol;
        this.registerDialOnlyProtocol(rest, opts);
        this.dialOnlyProtocols.set(protocolID, false);
        if (inboundRateLimits) {
            this.rateLimiter.initRateLimits(protocolID, inboundRateLimits);
        }
        return this.libp2p.handle(protocolID, this.getRequestHandler(protocol, protocolID));
    }
    /**
     * Remove protocol as supported and from libp2p.
     * async because libp2p registar persists the new protocol list in the peer-store.
     * Does NOT throw if the protocolID is unknown.
     * Can be called at any time, no concept of started / stopped
     */
    async unregisterProtocol(protocolID) {
        this.registeredProtocols.delete(protocolID);
        return this.libp2p.unhandle(protocolID);
    }
    /**
     * Remove all registered protocols from libp2p
     */
    async unregisterAllProtocols() {
        for (const protocolID of this.registeredProtocols.keys()) {
            await this.unregisterProtocol(protocolID);
        }
    }
    getRegisteredProtocols() {
        return Array.from(this.registeredProtocols.values()).map((protocol) => this.formatProtocolID(protocol));
    }
    async start() {
        this.controller = new AbortController();
        this.rateLimiter.start();
        // We set infinity to prevent MaxListenersExceededWarning which get logged when listeners > 10
        // Since it is perfectly fine to have listeners > 10
        setMaxListeners(Infinity, this.controller.signal);
    }
    async stop() {
        this.controller.abort();
    }
    // Helper to reduce code duplication
    async *sendRequest(peerId, method, versions, encoding, body) {
        var _a, _b;
        const peerClient = (_b = (_a = this.opts).getPeerLogMetadata) === null || _b === void 0 ? void 0 : _b.call(_a, peerId.toString());
        const protocols = [];
        const protocolIDs = [];
        for (const version of versions) {
            const protocolID = this.formatProtocolID({ method, version, encoding });
            const protocol = this.registeredProtocols.get(protocolID);
            if (!protocol) {
                throw Error(`Request to send to protocol ${protocolID} but it has not been declared`);
            }
            protocols.push(protocol);
            protocolIDs.push(protocolID);
        }
        try {
            yield* sendRequest({ logger: this.logger, libp2p: this.libp2p, peerClient }, peerId, protocols, protocolIDs, body, this.controller.signal, this.opts, this.reqCount++);
        }
        catch (e) {
            if (e instanceof RequestError) {
                this.onOutgoingRequestError(peerId, method, e);
            }
            throw e;
        }
    }
    getRequestHandler(protocol, protocolID) {
        return async ({ connection, stream, }) => {
            var _a, _b, _c;
            if (this.dialOnlyProtocols.get(protocolID)) {
                throw new Error(`Received request on dial only protocol '${protocolID}'`);
            }
            const peerId = connection.remotePeer;
            const peerClient = (_b = (_a = this.opts).getPeerLogMetadata) === null || _b === void 0 ? void 0 : _b.call(_a, peerId.toString());
            (_c = this.onIncomingRequest) === null || _c === void 0 ? void 0 : _c.call(this, peerId, protocol);
            try {
                await handleRequest({
                    logger: this.logger,
                    stream,
                    peerId: peerId,
                    protocol: protocol,
                    protocolID,
                    rateLimiter: this.rateLimiter,
                    signal: this.controller.signal,
                    requestId: this.reqCount++,
                    peerClient,
                    requestTimeoutMs: this.opts.requestTimeoutMs,
                });
                // TODO: Do success peer scoring here
            }
            catch (err) {
                if (err instanceof RequestError) {
                    this.onIncomingRequestError(protocol, err);
                }
                // TODO: Do error peer scoring here
                // Must not throw since this is an event handler
            }
        };
    }
    onIncomingRequest(_peerId, _protocol) {
        // Override
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onIncomingRequestError(_protocol, _error) {
        // Override
    }
    onOutgoingRequestError(_peerId, _method, _error) {
        // Override
    }
    /**
     * ```
     * /ProtocolPrefix/MessageName/SchemaVersion/Encoding
     * ```
     * https://github.com/ethereum/consensus-specs/blob/v1.2.0/specs/phase0/p2p-interface.md#protocol-identification
     */
    formatProtocolID(protocol) {
        return formatProtocolID(this.protocolPrefix, protocol.method, protocol.version, protocol.encoding);
    }
}
//# sourceMappingURL=ReqResp.js.map