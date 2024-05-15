import { PeerId } from "@libp2p/interface-peer-id";
import { Stream } from "@libp2p/interface-connection";
import { Logger } from "api/lib/logger";
import { ProtocolDefinition } from "../types";
import { ReqRespRateLimiter } from "../rate_limiter/ReqRespRateLimiter";
import { ResponseError } from "./errors";
export { ResponseError };
export declare const DEFAULT_REQUEST_TIMEOUT: number;
export interface HandleRequestOpts<Req, Resp> {
    logger: Logger;
    stream: Stream;
    peerId: PeerId;
    protocol: ProtocolDefinition<Req, Resp>;
    protocolID: string;
    rateLimiter: ReqRespRateLimiter;
    signal?: AbortSignal;
    requestId?: number;
    /** Peer client type for logging and metrics: 'prysm' | 'lighthouse' */
    peerClient?: string;
    /** Non-spec timeout from sending request until write stream closed by responder */
    requestTimeoutMs?: number;
}
/**
 * Handles a ReqResp request from a peer. Throws on error. Logs each step of the response lifecycle.
 *
 * 1. A duplex `stream` with the peer is already available
 * 2. Read and decode request from peer
 * 3. Delegate to `performRequestHandler()` to perform the request job and expect
 *    to yield zero or more `<response_chunks>`
 * 4a. Encode and write `<response_chunks>` to peer
 * 4b. On error, encode and write an error `<response_chunk>` and stop
 */
export declare function handleRequest<Req, Resp>({ logger, stream, peerId, protocol, protocolID, rateLimiter, signal, requestId, peerClient, requestTimeoutMs, }: HandleRequestOpts<Req, Resp>): Promise<void>;
//# sourceMappingURL=index.d.ts.map