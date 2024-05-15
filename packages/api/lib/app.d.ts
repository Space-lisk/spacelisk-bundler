import { Executor } from "executor/lib/executor";
import { Config } from "executor/lib/config";
import { EthAPI, DebugAPI, Web3API } from "./modules";
import { SkandhaAPI } from "./modules/skandha";
import { Server } from "./server";
export interface RpcHandlerOptions {
    config: Config;
}
export interface EtherspotBundlerOptions {
    server: Server;
    config: Config;
    executor: Executor;
    testingMode: boolean;
    redirectRpc: boolean;
}
export interface RelayerAPI {
    relayer: Executor;
    ethApi: EthAPI;
    debugApi: DebugAPI;
    web3Api: Web3API;
    skandhaApi: SkandhaAPI;
}
export declare class ApiApp {
    private server;
    private config;
    private executor;
    private testingMode;
    private redirectRpc;
    private ethApi;
    private debugApi;
    private web3Api;
    private redirectApi;
    private skandhaApi;
    private subscriptionApi;
    constructor(options: EtherspotBundlerOptions);
    private handleWsRequest;
    private handleRpcRequest;
}
//# sourceMappingURL=app.d.ts.map