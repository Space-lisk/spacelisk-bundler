import { anySignal } from "any-signal";
import { TimeoutError } from "./errors.js";
import { sleep } from "./sleep.js";
export async function withTimeout(asyncFn, timeoutMs, signal) {
    const timeoutAbortController = new AbortController();
    const timeoutAndParentSignal = anySignal([
        timeoutAbortController.signal,
        ...(signal ? [signal] : []),
    ]);
    async function timeoutPromise(signal) {
        await sleep(timeoutMs, signal);
        throw new TimeoutError();
    }
    try {
        return await Promise.race([
            asyncFn(timeoutAndParentSignal),
            timeoutPromise(timeoutAndParentSignal),
        ]);
    }
    finally {
        timeoutAbortController.abort();
    }
}
//# sourceMappingURL=timeout.js.map