import { PeerId } from "@libp2p/interface-peer-id";
import { Server } from "api/lib/server";
import { ApiApp } from "api/lib/app";
import { Config } from "executor/lib/config";
import { IDbController } from "types/lib";
import { INodeAPI } from "types/lib/node";
import { Executor } from "executor/lib/executor";
import { BundlingMode } from "types/lib/api/interfaces";
import { MetricsOptions } from "types/lib/options/metrics";
import { SkandhaVersion } from "types/lib/executor";
import { Network } from "./network/network";
import { SyncService } from "./sync";
import { IBundlerNodeOptions } from "./options";
export * from "./options";
export declare enum BundlerNodeStatus {
    started = "started",
    closing = "closing",
    closed = "closed",
    running = "running"
}
export interface BundlerNodeOptions {
    network: Network;
    server: Server;
    bundler: ApiApp;
    nodeApi: INodeAPI;
    executor: Executor;
    syncService: SyncService;
}
export interface BundlerNodeInitOptions {
    nodeOptions: IBundlerNodeOptions;
    relayersConfig: Config;
    relayerDb: IDbController;
    peerId?: PeerId;
    testingMode: boolean;
    redirectRpc: boolean;
    bundlingMode: BundlingMode;
    metricsOptions: MetricsOptions;
    version: SkandhaVersion;
}
export declare class BundlerNode {
    server: Server;
    bundler: ApiApp;
    status: BundlerNodeStatus;
    network: Network;
    syncService: SyncService;
    constructor(opts: BundlerNodeOptions);
    static init(opts: BundlerNodeInitOptions): Promise<BundlerNode>;
    start(): Promise<void>;
    /**
     * Stop beacon node and its sub-components.
     */
    close(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map