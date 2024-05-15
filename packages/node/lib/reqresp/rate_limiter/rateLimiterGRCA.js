/**
 * Generic Cell Rate Algorithm is a leaky bucket-type scheduling algorithm.
 *
 * Most rate-limit implementations are either time-bucket or leaky-bucket based. The time-bucket requires the storage
 * of two values and does not enforce a rate, while the leaky-bucket approach requires a separate process to
 * continually refill the bucket. GCRA only storing a value (the TAT) while still being simple. GCRA may be rarely
 * used because of its perceived complexity.
 *
 * GCRA aims to limit requests to `R = L/P`, where this implementation sets `L = 1` for simplicity. The target rate
 * then is `R = 1/P` so request separated by at least `P` are not limited. Define the Theoretical Arrival Time (TAT)
 * of the next request to be equal
 */
export class RateLimiterGRCA {
    constructor(
    /** After how long is the bucket considered full via replenishing 1T every `t`. */
    msPerBucket, 
    /** How often is 1 token replenished */
    msPerToken) {
        this.msPerBucket = msPerBucket;
        this.msPerToken = msPerToken;
        /** Time when the bucket will be full for each peer. TAT (theoretical arrival time) from GCRA */
        this.tatPerKey = new Map();
        this.startTimeMs = Date.now();
    }
    static fromQuota(quota) {
        if (quota.quota === 0) {
            throw Error("Max number of tokens should be positive");
        }
        const msPerBucket = quota.quotaTimeMs;
        if (msPerBucket === 0) {
            throw Error("Replenish time must be positive");
        }
        const msPerToken = msPerBucket / quota.quota;
        return new RateLimiterGRCA(msPerBucket, msPerToken);
    }
    allows(key, tokens) {
        if (tokens <= 0) {
            throw new Error(`Token value should always be positive. Given: ${tokens}.`);
        }
        const msSinceStart = Date.now() - this.startTimeMs;
        /** how long does it take to replenish these tokens */
        const additionalTime = this.msPerToken * tokens;
        if (additionalTime > this.msPerBucket) {
            // the time required to process this amount of tokens is longer than the time that makes the bucket full.
            return false;
        }
        // If the key is new, we consider their bucket full (which means, their request will be allowed)
        let resetTimeForKey = this.tatPerKey.get(key);
        if (resetTimeForKey === undefined) {
            resetTimeForKey = msSinceStart;
            this.tatPerKey.set(key, resetTimeForKey);
        }
        // check how soon could the request be made
        const earliestTime = resetTimeForKey + additionalTime - this.msPerBucket;
        if (msSinceStart < earliestTime) {
            return false;
        }
        // calculate the new TAT
        this.tatPerKey.set(key, Math.max(msSinceStart, resetTimeForKey) + additionalTime);
        return true;
    }
    /** Removes keys for which their bucket is full by `time_limit` */
    pruneByTime(timeLimit) {
        for (const entry of this.tatPerKey.entries()) {
            // remove those for which tat < lim
            if (entry[1] < timeLimit) {
                this.tatPerKey.delete(entry[0]);
            }
        }
    }
    pruneByKey(key) {
        this.tatPerKey.delete(key);
    }
}
//# sourceMappingURL=rateLimiterGRCA.js.map