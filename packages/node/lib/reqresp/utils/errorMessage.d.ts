/// <reference types="node" />
import { Encoding } from "../types";
/**
 * Encodes a UTF-8 string to 256 bytes max
 */
export declare function encodeErrorMessage(errorMessage: string, encoding: Encoding): AsyncGenerator<Buffer>;
/**
 * Decodes error message from network bytes and removes non printable, non ascii characters.
 */
export declare function decodeErrorMessage(errorMessage: Uint8Array): string;
//# sourceMappingURL=errorMessage.d.ts.map