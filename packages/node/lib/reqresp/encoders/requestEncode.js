import { EncodedPayloadType } from "../types.js";
import { writeEncodedPayload } from "../encodingStrategies/index.js";
/**
 * Yields byte chunks for a `<request>`
 * ```bnf
 * request  ::= <encoding-dependent-header> | <encoded-payload>
 * ```
 * Requests may contain no payload (e.g. /eth2/beacon_chain/req/metadata/1/)
 * if so, it would yield no byte chunks
 */
export async function* requestEncode(protocol, requestBody) {
    const type = protocol.requestType();
    if (type && requestBody !== null) {
        yield* writeEncodedPayload({ type: EncodedPayloadType.ssz, data: requestBody }, protocol.encoding, type);
    }
}
//# sourceMappingURL=requestEncode.js.map