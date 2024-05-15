/**
 * Wraps a promise to return either an error or result
 * ```ts
 * try {
 *   A()
 * } catch (e) {
 *   B()
 * }
 * ```
 * only EITHER fn A() and fn B() are called, but never both. In the snipped above
 * if A() throws, B() would be called.
 */
export async function wrapError(promise) {
    try {
        return { err: null, result: await promise };
    }
    catch (err) {
        return { err: err };
    }
}
//# sourceMappingURL=wrapError.js.map