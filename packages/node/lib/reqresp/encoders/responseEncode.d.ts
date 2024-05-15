/// <reference types="node" />
import { MixedProtocolDefinition, EncodedPayload, ProtocolDefinition } from "../types";
import { RpcResponseStatusError } from "../interface";
/**
 * Yields byte chunks for a `<response>` with a zero response code `<result>`
 * ```bnf
 * response        ::= <response_chunk>*
 * response_chunk  ::= <result> | <context-bytes> | <encoding-dependent-header> | <encoded-payload>
 * result          ::= "0"
 * ```
 * Note: `response` has zero or more chunks (denoted by `<>*`)
 */
export declare function responseEncodeSuccess<Req, Resp>(protocol: ProtocolDefinition<Req, Resp>): (source: AsyncIterable<EncodedPayload<Resp>>) => AsyncIterable<Buffer>;
/**
 * Yields byte chunks for a `<response_chunk>` with a non-zero response code `<result>`
 * denoted as `<error_response>`
 * ```bnf
 * error_response  ::= <result> | <error_message>?
 * result          ::= "1" | "2" | ["128" ... "255"]
 * ```
 * Only the last `<response_chunk>` is allowed to have a non-zero error code, so this
 * fn yields exactly one `<error_response>` and afterwards the stream must be terminated
 */
export declare function responseEncodeError(protocol: Pick<MixedProtocolDefinition, "encoding">, status: RpcResponseStatusError, errorMessage: string): AsyncGenerator<Buffer>;
//# sourceMappingURL=responseEncode.d.ts.map