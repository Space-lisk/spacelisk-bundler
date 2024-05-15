/// <reference types="node" />
import { MixedProtocolDefinition } from "../types";
/**
 * Yields byte chunks for a `<request>`
 * ```bnf
 * request  ::= <encoding-dependent-header> | <encoded-payload>
 * ```
 * Requests may contain no payload (e.g. /eth2/beacon_chain/req/metadata/1/)
 * if so, it would yield no byte chunks
 */
export declare function requestEncode<Req>(protocol: MixedProtocolDefinition<Req>, requestBody: Req): AsyncGenerator<Buffer>;
//# sourceMappingURL=requestEncode.d.ts.map