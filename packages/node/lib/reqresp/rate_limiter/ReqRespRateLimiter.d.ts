import { PeerId } from "@libp2p/interface-peer-id";
import { InboundRateLimitQuota, ReqRespRateLimiterOpts } from "../types";
type ProtocolID = string;
export declare class ReqRespRateLimiter {
    private readonly opts?;
    private readonly rateLimitersPerPeer;
    private readonly rateLimitersTotal;
    /** Interval to check lastSeenMessagesByPeer */
    private cleanupInterval;
    private rateLimitMultiplier;
    /** Periodically check this to remove tracker of disconnected peers */
    private lastSeenRequestsByPeer;
    constructor(opts?: ReqRespRateLimiterOpts | undefined);
    get enabled(): boolean;
    initRateLimits<Req>(protocolID: ProtocolID, rateLimits: InboundRateLimitQuota<Req>): void;
    allows(peerId: PeerId, protocolID: string, requestCount: number): boolean;
    prune(peerId: PeerId): void;
    start(): void;
    stop(): void;
    private pruneByPeerIdStr;
    private checkDisconnectedPeers;
}
export {};
//# sourceMappingURL=ReqRespRateLimiter.d.ts.map