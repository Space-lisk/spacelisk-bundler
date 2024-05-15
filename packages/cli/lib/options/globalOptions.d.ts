/// <reference types="yargs" />
import { IApiArgs } from "./bundlerOptions/api.js";
import { INetworkArgs } from "./bundlerOptions/network.js";
import { IExecutorArgs } from "./bundlerOptions/executor.js";
import { IMetricsArgs } from "./bundlerOptions/metrics.js";
interface IGlobalSingleArgs {
    dataDir: string;
    configFile: string;
    testingMode: boolean;
    unsafeMode: boolean;
    redirectRpc: boolean;
}
export declare const defaultNetwork = "goerli";
export declare const defaultNetworksFile = "config.json";
export type IGlobalArgs = IGlobalSingleArgs & IApiArgs & INetworkArgs & IExecutorArgs;
export declare const globalOptions: {
    "metrics.enable": import("yargs").Options;
    "metrics.host": import("yargs").Options;
    "metrics.port": import("yargs").Options;
    "executor.bundlingMode": import("yargs").Options;
    "p2p.host": import("yargs").Options;
    "p2p.port": import("yargs").Options;
    "p2p.enrHost": import("yargs").Options;
    "p2p.enrPort": import("yargs").Options;
    "p2p.bootEnrs": import("yargs").Options;
    "p2p.retainPeerId": import("yargs").Options;
    "api.cors": import("yargs").Options;
    "api.address": import("yargs").Options;
    "api.port": import("yargs").Options;
    "api.enableRequestLogging": import("yargs").Options;
    "api.ws": import("yargs").Options;
    "api.wsPort": import("yargs").Options;
    dataDir: import("yargs").Options;
    configFile: import("yargs").Options;
    testingMode: import("yargs").Options;
    unsafeMode: import("yargs").Options;
    redirectRpc: import("yargs").Options;
};
export type IStandaloneGlobalArgs = IGlobalSingleArgs & IApiArgs & IExecutorArgs & IMetricsArgs;
export declare const standaloneGlobalOptions: {
    "metrics.enable": import("yargs").Options;
    "metrics.host": import("yargs").Options;
    "metrics.port": import("yargs").Options;
    "executor.bundlingMode": import("yargs").Options;
    "api.cors": import("yargs").Options;
    "api.address": import("yargs").Options;
    "api.port": import("yargs").Options;
    "api.enableRequestLogging": import("yargs").Options;
    "api.ws": import("yargs").Options;
    "api.wsPort": import("yargs").Options;
    dataDir: import("yargs").Options;
    configFile: import("yargs").Options;
    testingMode: import("yargs").Options;
    unsafeMode: import("yargs").Options;
    redirectRpc: import("yargs").Options;
};
export {};
//# sourceMappingURL=globalOptions.d.ts.map