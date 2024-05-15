import { ICliCommandOptions } from "../../util";
import { IBundlerOptions } from "./options";
export interface INetworkArgs {
    "p2p.host": string;
    "p2p.port": number;
    "p2p.enrHost": string;
    "p2p.enrPort": number;
    "p2p.bootEnrs": string[];
    "p2p.retainPeerId": boolean;
}
export declare function parseArgs(args: INetworkArgs): IBundlerOptions["p2p"];
export declare const options: ICliCommandOptions<INetworkArgs>;
//# sourceMappingURL=network.d.ts.map