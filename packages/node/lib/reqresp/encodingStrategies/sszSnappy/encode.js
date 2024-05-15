import { encode as varintEncode } from "uint8-varint";
import { EncodedPayloadType, } from "../../types.js";
import { SszSnappyError, SszSnappyErrorCode } from "./errors.js";
import { encodeSnappy } from "./snappyFrames/compress.js";
/**
 * ssz_snappy encoding strategy writer.
 * Yields byte chunks for encoded header and payload as defined in the spec:
 * ```
 * <encoding-dependent-header> | <encoded-payload>
 * ```
 */
export async function* writeSszSnappyPayload(body, type) {
    const serializedBody = serializeSszBody(body, type);
    yield* encodeSszSnappy(serializedBody);
}
/**
 * Buffered Snappy writer
 */
export async function* encodeSszSnappy(bytes) {
    // MUST encode the length of the raw SSZ bytes, encoded as an unsigned protobuf varint
    yield Buffer.from(varintEncode(bytes.length));
    // By first computing and writing the SSZ byte length, the SSZ encoder can then directly
    // write the chunk contents to the stream. Snappy writer compresses frame by frame
    yield* encodeSnappy(bytes);
}
/**
 * Returns SSZ serialized body. Wrapps errors with SszSnappyError.SERIALIZE_ERROR
 */
function serializeSszBody(chunk, type) {
    switch (chunk.type) {
        case EncodedPayloadType.bytes:
            return chunk.bytes;
        case EncodedPayloadType.ssz: {
            try {
                const bytes = type.serialize(chunk.data);
                return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.length);
            }
            catch (e) {
                throw new SszSnappyError({
                    code: SszSnappyErrorCode.SERIALIZE_ERROR,
                    serializeError: e,
                });
            }
        }
    }
}
//# sourceMappingURL=encode.js.map