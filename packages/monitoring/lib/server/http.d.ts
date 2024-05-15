import { Registry } from "prom-client";
import { Logger } from "types/lib";
export type HttpMetricsServerOpts = {
    port: number;
    address?: string;
};
export type HttpMetricsServer = {
    close(): Promise<void>;
};
export declare function getHttpMetricsServer(port: number, address: string, registry: Registry, logger: Logger): Promise<HttpMetricsServer>;
//# sourceMappingURL=http.d.ts.map