/// <reference types="node" />
import { EncodedPayload, TypeSerializer } from "../../types";
/**
 * ssz_snappy encoding strategy writer.
 * Yields byte chunks for encoded header and payload as defined in the spec:
 * ```
 * <encoding-dependent-header> | <encoded-payload>
 * ```
 */
export declare function writeSszSnappyPayload<T>(body: EncodedPayload<T>, type: TypeSerializer<T>): AsyncGenerator<Buffer>;
/**
 * Buffered Snappy writer
 */
export declare function encodeSszSnappy(bytes: Buffer): AsyncGenerator<Buffer>;
//# sourceMappingURL=encode.d.ts.map