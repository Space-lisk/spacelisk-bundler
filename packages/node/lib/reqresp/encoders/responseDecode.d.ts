import { Uint8ArrayList } from "uint8arraylist";
import { BufferedSource } from "../utils";
import { ContextBytesFactory, MixedProtocolDefinition } from "../types";
import { RespStatus } from "../interface";
/**
 * Internal helper type to signal stream ended early
 */
declare enum StreamStatus {
    Ended = "STREAM_ENDED"
}
/**
 * Consumes a stream source to read a `<response>`
 * ```bnf
 * response        ::= <response_chunk>*
 * response_chunk  ::= <result> | <context-bytes> | <encoding-dependent-header> | <encoded-payload>
 * result          ::= "0" | "1" | "2" | ["128" ... "255"]
 * ```
 */
export declare function responseDecode<Resp>(protocol: MixedProtocolDefinition, cbs: {
    onFirstHeader: () => void;
    onFirstResponseChunk: () => void;
}): (source: AsyncIterable<Uint8Array | Uint8ArrayList>) => AsyncIterable<Resp>;
/**
 * Consumes a stream source to read a `<result>`
 * ```bnf
 * result  ::= "0" | "1" | "2" | ["128" ... "255"]
 * ```
 * `<response_chunk>` starts with a single-byte response code which determines the contents of the response_chunk
 */
export declare function readResultHeader(bufferedSource: BufferedSource): Promise<RespStatus | StreamStatus>;
/**
 * Consumes a stream source to read an optional `<error_response>?`
 * ```bnf
 * error_response  ::= <result> | <error_message>?
 * result          ::= "1" | "2" | ["128" ... "255"]
 * ```
 */
export declare function readErrorMessage(bufferedSource: BufferedSource): Promise<string>;
/**
 * Consumes a stream source to read a variable length `<context-bytes>` depending on the method.
 * While `<context-bytes>` has a single type of `ForkDigest`, this function only parses the `ForkName`
 * of the `ForkDigest` or defaults to `phase0`
 */
export declare function readContextBytes(contextBytes: ContextBytesFactory): Promise<string>;
/**
 * Consumes a stream source to read `<context-bytes>`, where it's a fixed-width 4 byte
 */
export declare function readContextBytesForkDigest(bufferedSource: BufferedSource): Promise<Uint8Array>;
export {};
//# sourceMappingURL=responseDecode.d.ts.map