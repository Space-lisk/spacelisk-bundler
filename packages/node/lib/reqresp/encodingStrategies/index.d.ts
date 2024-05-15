/// <reference types="node" />
import { Encoding, EncodedPayload, TypeSerializer } from "../types";
import { BufferedSource } from "../utils";
/**
 * Consumes a stream source to read encoded header and payload as defined in the spec:
 * ```
 * <encoding-dependent-header> | <encoded-payload>
 * ```
 */
export declare function readEncodedPayload<T>(bufferedSource: BufferedSource, encoding: Encoding, type: TypeSerializer<T>): Promise<T>;
/**
 * Yields byte chunks for encoded header and payload as defined in the spec:
 * ```
 * <encoding-dependent-header> | <encoded-payload>
 * ```
 */
export declare function writeEncodedPayload<T>(chunk: EncodedPayload<T>, encoding: Encoding, serializer: TypeSerializer<T>): AsyncGenerator<Buffer>;
//# sourceMappingURL=index.d.ts.map