import { BufferedSource } from "../../utils";
import { TypeSerializer } from "../../types";
export declare const MAX_VARINT_BYTES = 10;
/**
 * ssz_snappy encoding strategy reader.
 * Consumes a stream source to read encoded header and payload as defined in the spec:
 * ```bnf
 * <encoding-dependent-header> | <encoded-payload>
 * ```
 */
export declare function readSszSnappyPayload<T>(bufferedSource: BufferedSource, type: TypeSerializer<T>): Promise<T>;
/**
 * Reads `<encoding-dependent-header>` for ssz-snappy.
 * encoding-header ::= the length of the raw SSZ bytes, encoded as an unsigned protobuf varint
 */
export declare function readSszSnappyHeader(bufferedSource: BufferedSource, type: Pick<TypeSerializer<unknown>, "minSize" | "maxSize">): Promise<number>;
/**
 * Reads `<encoded-payload>` for ssz-snappy and decompress.
 * The returned bytes can be SSZ deseralized
 */
export declare function readSszSnappyBody(bufferedSource: BufferedSource, sszDataLength: number): Promise<Uint8Array>;
//# sourceMappingURL=decode.d.ts.map