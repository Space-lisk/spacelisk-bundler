import { Registry } from "prom-client";
import { Logger } from "types/lib";
import { IChainMetrics, IP2PMetrics } from "./metrics";
export type PerChainMetrics = IChainMetrics & Partial<IP2PMetrics>;
export type AllChainsMetrics = {
    [chainId: number]: PerChainMetrics;
};
export type CreateMetricsRes = {
    addChain: (chainId: number) => void;
    chains: AllChainsMetrics;
    registry: Registry;
};
export type CreateMetricsOptions = {
    p2p: boolean;
};
export declare function createMetrics(options: CreateMetricsOptions, logger: Logger): CreateMetricsRes;
//# sourceMappingURL=createMetrics.d.ts.map