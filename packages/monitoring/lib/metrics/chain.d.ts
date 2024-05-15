import { Registry, Counter, Histogram } from "prom-client";
export interface IChainMetrics {
    useropsInMempool: Counter.Internal;
    useropsAttempted: Counter.Internal;
    useropsSubmitted: Counter.Internal;
    useropsEstimated: Counter.Internal;
    useropsTimeToProcess: Histogram.Internal<"chainId">;
    bundlesSubmitted: Counter.Internal;
    bundlesFailed: Counter.Internal;
    useropsInBundle: Histogram.Internal<"chainId">;
}
/**
 * Per chain metrics
 */
export declare function createChainMetrics(registry: Registry, chainId: number): IChainMetrics;
//# sourceMappingURL=chain.d.ts.map