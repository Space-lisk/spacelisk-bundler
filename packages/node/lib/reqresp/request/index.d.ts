import { PeerId } from "@libp2p/interface-peer-id";
import { Libp2p } from "libp2p";
import { Logger } from "api/lib/logger";
import { MixedProtocolDefinition } from "../types";
import { RequestError, RequestErrorCode } from "./errors";
export { RequestError, RequestErrorCode };
export declare const DEFAULT_DIAL_TIMEOUT: number;
export declare const DEFAULT_REQUEST_TIMEOUT: number;
export declare const DEFAULT_TTFB_TIMEOUT: number;
export declare const DEFAULT_RESP_TIMEOUT: number;
export interface SendRequestOpts {
    /** The maximum time for complete response transfer. */
    respTimeoutMs?: number;
    /** Non-spec timeout from sending request until write stream closed by responder */
    requestTimeoutMs?: number;
    /** The maximum time to wait for first byte of request response (time-to-first-byte). */
    ttfbTimeoutMs?: number;
    /** Non-spec timeout from dialing protocol until stream opened */
    dialTimeoutMs?: number;
}
type SendRequestModules = {
    logger: Logger;
    libp2p: Libp2p;
    peerClient?: string;
};
/**
 * Sends ReqResp request to a peer. Throws on error. Logs each step of the request lifecycle.
 *
 * 1. Dial peer, establish duplex stream
 * 2. Encoded and write request to peer. Expect the responder to close the stream's write side
 * 3. Read and decode response(s) from peer. Will close the read stream if:
 *    - An error result is received in one of the chunks. Reads the error_message and throws.
 *    - The responder closes the stream. If at the end or start of a <response_chunk>, return. Otherwise throws
 *    - Any part of the response_chunk fails validation. Throws a typed error (see `SszSnappyError`)
 *    - The maximum number of requested chunks are read. Does not throw, returns read chunks only.
 */
export declare function sendRequest<Req, Resp>({ logger, libp2p, peerClient }: SendRequestModules, peerId: PeerId, protocols: MixedProtocolDefinition[], protocolIDs: string[], requestBody: Req, signal?: AbortSignal, opts?: SendRequestOpts, requestId?: number): AsyncIterable<Resp>;
//# sourceMappingURL=index.d.ts.map