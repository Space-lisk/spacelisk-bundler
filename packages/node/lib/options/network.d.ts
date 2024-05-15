import { SignableENR } from "@chainsafe/discv5";
import { P2POptions } from "types/lib/options";
import { PeerManagerOpts } from "./peers";
export declare const defaultP2PHost = "127.0.0.1";
export declare const defaultP2PPort = 4337;
export interface INetworkOptions extends PeerManagerOpts {
    localMultiaddrs: string[];
    bootMultiaddrs?: string[];
    mdns: boolean;
    connectToDiscv5Bootnodes?: boolean;
    version?: string;
    dataDir: string;
}
export declare const initNetworkOptions: (enr: SignableENR, p2pOptions: P2POptions, dataDir: string) => INetworkOptions;
export declare const defaultNetworkOptions: INetworkOptions;
//# sourceMappingURL=network.d.ts.map