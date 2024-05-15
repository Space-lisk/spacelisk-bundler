import { ICliCommandOptions } from "../../util";
import { IBundlerOptions } from "./options";
export interface IMetricsArgs {
    "metrics.enable": boolean;
    "metrics.host": string;
    "metrics.port": number;
}
export declare function parseArgs(args: IMetricsArgs): IBundlerOptions["metrics"];
export declare const options: ICliCommandOptions<IMetricsArgs>;
//# sourceMappingURL=metrics.d.ts.map