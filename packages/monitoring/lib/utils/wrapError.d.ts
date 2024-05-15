export type Result<T> = {
    err: null;
    result: T;
} | {
    err: Error;
};
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
export declare function wrapError<T>(promise: Promise<T>): Promise<Result<T>>;
//# sourceMappingURL=wrapError.d.ts.map