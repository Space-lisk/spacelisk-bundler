import { Sink } from "it-stream-types";
import { Uint8ArrayList } from "uint8arraylist";
import { MixedProtocolDefinition } from "../types";
/**
 * Consumes a stream source to read a `<request>`
 * ```bnf
 * request  ::= <encoding-dependent-header> | <encoded-payload>
 * ```
 */
export declare function requestDecode<Req, Resp>(protocol: MixedProtocolDefinition<Req, Resp>): Sink<Uint8Array | Uint8ArrayList, Promise<Req>>;
//# sourceMappingURL=requestDecode.d.ts.map