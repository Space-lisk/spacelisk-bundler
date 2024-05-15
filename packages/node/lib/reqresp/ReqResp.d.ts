import { Logger } from "api/lib/logger";
import { Libp2p } from "libp2p";
import { PeerId } from "@libp2p/interface-peer-id";
import { DialOnlyProtocolDefinition, Encoding, MixedProtocolDefinition, ProtocolDefinition, ReqRespRateLimiterOpts } from "./types";
import { RequestError, SendRequestOpts } from "./request";
type ProtocolID = string;
export declare const DEFAULT_PROTOCOL_PREFIX = "/account_abstraction/req";
export interface ReqRespProtocolModules {
    libp2p: Libp2p;
    logger: Logger;
}
export interface ReqRespOpts extends SendRequestOpts, ReqRespRateLimiterOpts {
    /** Custom prefix for `/ProtocolPrefix/MessageName/SchemaVersion/Encoding` */
    protocolPrefix?: string;
    getPeerLogMetadata?: (peerId: string) => string;
}
export interface ReqRespRegisterOpts {
    ignoreIfDuplicate?: boolean;
}
export declare class ReqResp {
    private readonly opts;
    protected readonly libp2p: Libp2p;
    protected readonly logger: Logger;
    private readonly rateLimiter;
    private controller;
    /** Tracks request and responses in a sequential counter */
    private reqCount;
    private readonly protocolPrefix;
    /** `${protocolPrefix}/${method}/${version}/${encoding}` */
    private readonly registeredProtocols;
    private readonly dialOnlyProtocols;
    constructor(modules: ReqRespProtocolModules, opts?: ReqRespOpts);
    /**
     * Register protocol which will be used only to dial to other peers
     * The libp2p instance will not handle that protocol
     *
     * Made it explicit method to avoid any developer mistake
     */
    registerDialOnlyProtocol<Req, Resp>(protocol: DialOnlyProtocolDefinition<Req, Resp>, opts?: ReqRespRegisterOpts): void;
    /**
     * Register protocol as supported and to libp2p.
     * async because libp2p registar persists the new protocol list in the peer-store.
     * Throws if the same protocol is registered twice.
     * Can be called at any time, no concept of started / stopped
     */
    registerProtocol<Req, Resp>(protocol: ProtocolDefinition<Req, Resp>, opts?: ReqRespRegisterOpts): Promise<void>;
    /**
     * Remove protocol as supported and from libp2p.
     * async because libp2p registar persists the new protocol list in the peer-store.
     * Does NOT throw if the protocolID is unknown.
     * Can be called at any time, no concept of started / stopped
     */
    unregisterProtocol(protocolID: ProtocolID): Promise<void>;
    /**
     * Remove all registered protocols from libp2p
     */
    unregisterAllProtocols(): Promise<void>;
    getRegisteredProtocols(): ProtocolID[];
    start(): Promise<void>;
    stop(): Promise<void>;
    protected sendRequest<Req, Resp>(peerId: PeerId, method: string, versions: number[], encoding: Encoding, body: Req): AsyncIterable<Resp>;
    private getRequestHandler;
    protected onIncomingRequest(_peerId: PeerId, _protocol: MixedProtocolDefinition): void;
    protected onIncomingRequestError(_protocol: MixedProtocolDefinition<any, any>, _error: RequestError): void;
    protected onOutgoingRequestError(_peerId: PeerId, _method: string, _error: RequestError): void;
    /**
     * ```
     * /ProtocolPrefix/MessageName/SchemaVersion/Encoding
     * ```
     * https://github.com/ethereum/consensus-specs/blob/v1.2.0/specs/phase0/p2p-interface.md#protocol-identification
     */
    protected formatProtocolID(protocol: Pick<MixedProtocolDefinition, "method" | "version" | "encoding">): string;
}
export {};
//# sourceMappingURL=ReqResp.d.ts.map