import { toBufferLE, toBigIntLE, toBufferBE, toBigIntBE } from "bigint-buffer";
const hexByByte = [];
export function toHexString(bytes) {
    let hex = "0x";
    for (const byte of bytes) {
        if (!hexByByte[byte]) {
            hexByByte[byte] = byte < 16 ? "0" + byte.toString(16) : byte.toString(16);
        }
        hex += hexByByte[byte];
    }
    return hex;
}
/**
 * Return a byte array from a number or BigInt
 */
export function intToBytes(value, length, endianness = "le") {
    return bigIntToBytes(BigInt(value), length, endianness);
}
/**
 * Convert byte array in LE to integer.
 */
export function bytesToInt(value, endianness = "le") {
    return Number(bytesToBigInt(value, endianness));
}
export function bigIntToBytes(value, length, endianness = "le") {
    if (endianness === "le") {
        return toBufferLE(value, length);
    }
    else if (endianness === "be") {
        return toBufferBE(value, length);
    }
    throw new Error("endianness must be either 'le' or 'be'");
}
export function bytesToBigInt(value, endianness = "le") {
    if (endianness === "le") {
        return toBigIntLE(value);
    }
    else if (endianness === "be") {
        return toBigIntBE(value);
    }
    throw new Error("endianness must be either 'le' or 'be'");
}
export function toHex(buffer) {
    if (Buffer.isBuffer(buffer)) {
        return "0x" + buffer.toString("hex");
    }
    else if (buffer instanceof Uint8Array) {
        return ("0x" +
            Buffer.from(buffer.buffer, buffer.byteOffset, buffer.length).toString("hex"));
    }
    else {
        return "0x" + Buffer.from(buffer).toString("hex");
    }
}
export function fromHex(hex) {
    const b = Buffer.from(hex.replace("0x", ""), "hex");
    return new Uint8Array(b.buffer, b.byteOffset, b.length);
}
//# sourceMappingURL=bytes.js.map