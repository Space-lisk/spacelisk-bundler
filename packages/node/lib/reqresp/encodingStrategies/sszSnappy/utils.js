/**
 * Computes the worst-case compression result by SSZ-Snappy
 */
export function maxEncodedLen(sszLength) {
    // worst-case compression result by Snappy
    return 32 + sszLength + sszLength / 6;
}
//# sourceMappingURL=utils.js.map