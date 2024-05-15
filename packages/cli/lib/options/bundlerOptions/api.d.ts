import { ICliCommandOptions } from "../../util";
import { IBundlerOptions } from "./options";
export interface IApiArgs {
    "api.cors": string;
    "api.address": string;
    "api.port": number;
    "api.enableRequestLogging": boolean;
    "api.ws": boolean;
    "api.wsPort": number;
}
export declare function parseArgs(args: IApiArgs): IBundlerOptions["api"];
export declare const options: ICliCommandOptions<IApiArgs>;
//# sourceMappingURL=api.d.ts.map