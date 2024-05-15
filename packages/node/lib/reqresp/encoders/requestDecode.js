import { BufferedSource } from "../utils/index.js";
import { readEncodedPayload } from "../encodingStrategies/index.js";
/**
 * Consumes a stream source to read a `<request>`
 * ```bnf
 * request  ::= <encoding-dependent-header> | <encoded-payload>
 * ```
 */
export function requestDecode(protocol) {
    return async function requestDecodeSink(source) {
        const type = protocol.requestType();
        if (type === null) {
            // method has no body
            return null;
        }
        // Request has a single payload, so return immediately
        const bufferedSource = new BufferedSource(source);
        return readEncodedPayload(bufferedSource, protocol.encoding, type);
    };
}
//# sourceMappingURL=requestDecode.js.map