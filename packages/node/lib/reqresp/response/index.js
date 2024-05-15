import { pipe } from "it-pipe";
import { TimeoutError, withTimeout } from "utils/lib/index.js";
import { prettyPrintPeerId } from "../utils/index.js";
import { requestDecode } from "../encoders/requestDecode.js";
import { responseEncodeError, responseEncodeSuccess, } from "../encoders/responseEncode.js";
import { RespStatus } from "../interface.js";
import { RequestError, RequestErrorCode } from "../request/errors.js";
import { ResponseError } from "./errors.js";
export { ResponseError };
// Default spec values from https://github.com/ethereum/consensus-specs/blob/v1.2.0/specs/phase0/p2p-interface.md#configuration
export const DEFAULT_REQUEST_TIMEOUT = 5 * 1000; // 5 sec
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
export async function handleRequest({ logger, stream, peerId, protocol, protocolID, rateLimiter, signal, requestId = 0, peerClient = "unknown", requestTimeoutMs, }) {
    const REQUEST_TIMEOUT = requestTimeoutMs !== null && requestTimeoutMs !== void 0 ? requestTimeoutMs : DEFAULT_REQUEST_TIMEOUT;
    const logCtx = {
        method: protocol.method,
        client: peerClient,
        peer: prettyPrintPeerId(peerId),
        requestId,
    };
    let responseError = null;
    await pipe(
    // Yields success chunks and error chunks in the same generator
    // This syntax allows to recycle stream.sink to send success and error chunks without returning
    // in case request whose body is a List fails at chunk_i > 0, without breaking out of the for..await..of
    (async function* requestHandlerSource() {
        var _a, _b, _c, _d;
        try {
            const requestBody = await withTimeout(() => pipe(stream.source, requestDecode(protocol)), REQUEST_TIMEOUT, signal).catch((e) => {
                if (e instanceof TimeoutError) {
                    throw e; // Let outter catch {} re-type the error as SERVER_ERROR
                }
                else {
                    throw new ResponseError(RespStatus.INVALID_REQUEST, e.message);
                }
            });
            logger.debug({
                ...logCtx,
                body: (_a = protocol.renderRequestBody) === null || _a === void 0 ? void 0 : _a.call(protocol, requestBody),
            }, "Req  received");
            const requestCount = (_d = (_c = (_b = protocol === null || protocol === void 0 ? void 0 : protocol.inboundRateLimits) === null || _b === void 0 ? void 0 : _b.getRequestCount) === null || _c === void 0 ? void 0 : _c.call(_b, requestBody)) !== null && _d !== void 0 ? _d : 1;
            if (!rateLimiter.allows(peerId, protocolID, requestCount)) {
                throw new RequestError({ code: RequestErrorCode.REQUEST_RATE_LIMITED }, {
                    peer: peerId.toString(),
                    method: protocol.method,
                    encoding: protocol.encoding,
                });
            }
            yield* pipe(
            // TODO: Debug the reason for type conversion here
            protocol.handler(requestBody, peerId), 
            // NOTE: Do not log the resp chunk contents, logs get extremely cluttered
            // Note: Not logging on each chunk since after 1 year it hasn't add any value when debugging
            // onChunk(() => logger.debug("Resp sending chunk", logCtx)),
            responseEncodeSuccess(protocol));
        }
        catch (e) {
            const status = e instanceof ResponseError ? e.status : RespStatus.SERVER_ERROR;
            yield* responseEncodeError(protocol, status, e.message);
            // Should not throw an error here or libp2p-mplex throws with 'AbortError: stream reset'
            // throw e;
            responseError = e;
        }
    })(), stream.sink);
    // If streak.sink throws, libp2p-mplex will close stream.source
    // If `requestDecode()` throws the stream.source must be closed manually
    // To ensure the stream.source it-pushable instance is always closed, stream.close() is called always
    stream.close();
    // TODO: It may happen that stream.sink returns before returning stream.source first,
    // so you never see "Resp received request" in the logs and the response ends without
    // sending any chunk, triggering EMPTY_RESPONSE error on the requesting side
    // It has only happened when doing a request too fast upon immediate connection on inbound peer
    // investigate a potential race condition there
    if (responseError !== null) {
        logger.debug({ ...logCtx, responseError }, "Resp  error");
        throw responseError;
    }
    else {
        // NOTE: Only log once per request to verbose, intermediate steps to debug
        logger.debug(logCtx, "Resp  done");
    }
}
//# sourceMappingURL=index.js.map