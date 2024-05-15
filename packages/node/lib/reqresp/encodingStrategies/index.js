import { Encoding } from "../types.js";
import { readSszSnappyPayload } from "./sszSnappy/decode.js";
import { writeSszSnappyPayload } from "./sszSnappy/encode.js";
// For more info about Ethereum Consensus request/response encoding strategies, see:
// https://github.com/ethereum/consensus-specs/blob/v1.1.10/specs/phase0/p2p-interface.md#encoding-strategies
// Supported encoding strategies:
// - ssz_snappy
/**
 * Consumes a stream source to read encoded header and payload as defined in the spec:
 * ```
 * <encoding-dependent-header> | <encoded-payload>
 * ```
 */
export async function readEncodedPayload(bufferedSource, encoding, type) {
    switch (encoding) {
        case Encoding.SSZ_SNAPPY:
            return readSszSnappyPayload(bufferedSource, type);
        default:
            throw Error("Unsupported encoding");
    }
}
/**
 * Yields byte chunks for encoded header and payload as defined in the spec:
 * ```
 * <encoding-dependent-header> | <encoded-payload>
 * ```
 */
export async function* writeEncodedPayload(chunk, encoding, serializer) {
    switch (encoding) {
        case Encoding.SSZ_SNAPPY:
            yield* writeSszSnappyPayload(chunk, serializer);
            break;
        default:
            throw Error("Unsupported encoding");
    }
}
//# sourceMappingURL=index.js.map