import { ErrorAborted } from "./errors.js";
/**
 * Abortable sleep function. Cleans everything on all cases preventing leaks
 * On abort throws ErrorAborted
 */
export async function sleep(ms, signal) {
    if (ms < 0) {
        return;
    }
    return new Promise((resolve, reject) => {
        if (signal && signal.aborted)
            return reject(new ErrorAborted());
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        let onDone = () => { };
        const timeout = setTimeout(() => {
            onDone();
            resolve();
        }, ms);
        const onAbort = () => {
            onDone();
            reject(new ErrorAborted());
        };
        if (signal)
            signal.addEventListener("abort", onAbort);
        onDone = () => {
            clearTimeout(timeout);
            if (signal)
                signal.removeEventListener("abort", onAbort);
        };
    });
}
//# sourceMappingURL=sleep.js.map