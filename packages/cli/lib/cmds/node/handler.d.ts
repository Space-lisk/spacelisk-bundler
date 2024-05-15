import { ExecutorOptions, ApiOptions, P2POptions } from "types/lib/options";
import { MetricsOptions } from "types/lib/options/metrics";
import { IGlobalArgs } from "../../options";
export declare function nodeHandler(args: IGlobalArgs): Promise<void>;
export declare function getNodeConfigFromArgs(args: IGlobalArgs): Promise<{
    configFile: string;
    dataDir: string;
    testingMode: boolean;
    unsafeMode: boolean;
    redirectRpc: boolean;
    p2p: P2POptions;
    api: ApiOptions;
    executor: ExecutorOptions;
    metrics: MetricsOptions;
}>;
//# sourceMappingURL=handler.d.ts.map