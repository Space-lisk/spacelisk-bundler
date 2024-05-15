export class SkandhaError extends Error {
    constructor(type, message) {
        super(message || type.code);
        this.type = type;
    }
    getMetadata() {
        return this.type;
    }
    /**
     * Get the metadata and the stacktrace for the error.
     */
    toObject() {
        return {
            // Ignore message since it's just type.code
            ...this.getMetadata(),
            stack: this.stack || "",
        };
    }
}
/**
 * Throw this error when an upstream abort signal aborts
 */
export class ErrorAborted extends Error {
    constructor(message) {
        super(`Aborted ${message || ""}`);
    }
}
/**
 * Throw this error when wrapped timeout expires
 */
export class TimeoutError extends Error {
    constructor(message) {
        super(`Timeout ${message || ""}`);
    }
}
/**
 * Returns true if arg `e` is an instance of `ErrorAborted`
 */
export function isErrorAborted(e) {
    return e instanceof ErrorAborted;
}
/**
 * Extend an existing error by appending a string to its `e.message`
 */
export function extendError(e, appendMessage) {
    e.message = `${e.message} - ${appendMessage}`;
    return e;
}
//# sourceMappingURL=errors.js.map