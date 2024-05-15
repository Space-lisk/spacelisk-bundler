export declare class SkandhaError<T extends {
    code: string;
}> extends Error {
    type: T;
    constructor(type: T, message?: string);
    getMetadata(): Record<string, string | number | null>;
    /**
     * Get the metadata and the stacktrace for the error.
     */
    toObject(): Record<string, string | number | null>;
}
/**
 * Throw this error when an upstream abort signal aborts
 */
export declare class ErrorAborted extends Error {
    constructor(message?: string);
}
/**
 * Throw this error when wrapped timeout expires
 */
export declare class TimeoutError extends Error {
    constructor(message?: string);
}
/**
 * Returns true if arg `e` is an instance of `ErrorAborted`
 */
export declare function isErrorAborted(e: unknown): e is ErrorAborted;
/**
 * Extend an existing error by appending a string to its `e.message`
 */
export declare function extendError(e: Error, appendMessage: string): Error;
//# sourceMappingURL=errors.d.ts.map