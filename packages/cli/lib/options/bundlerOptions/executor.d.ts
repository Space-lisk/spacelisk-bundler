import { ICliCommandOptions } from "../../util";
import { IBundlerOptions } from "./options";
export interface IExecutorArgs {
    "executor.bundlingMode": "auto" | "manual";
}
export declare function parseArgs(args: IExecutorArgs): IBundlerOptions["executor"];
export declare const options: ICliCommandOptions<IExecutorArgs>;
//# sourceMappingURL=executor.d.ts.map