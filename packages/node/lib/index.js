import { Server } from "api/lib/server.js";
import { ApiApp } from "api/lib/app.js";
import { Executor } from "executor/lib/executor.js";
import logger from "api/lib/logger.js";
import { createMetrics, getHttpMetricsServer } from "monitoring/lib/index.js";
import { Network } from "./network/network.js";
import { SyncService } from "./sync/index.js";
import { getApi } from "./api/index.js";
export * from "./options/index.js";
export var BundlerNodeStatus;
(function (BundlerNodeStatus) {
    BundlerNodeStatus["started"] = "started";
    BundlerNodeStatus["closing"] = "closing";
    BundlerNodeStatus["closed"] = "closed";
    BundlerNodeStatus["running"] = "running";
})(BundlerNodeStatus || (BundlerNodeStatus = {}));
export class BundlerNode {
    constructor(opts) {
        this.status = BundlerNodeStatus.started;
        this.network = opts.network;
        this.server = opts.server;
        this.bundler = opts.bundler;
        this.syncService = opts.syncService;
    }
    static async init(opts) {
        var _a;
        const { nodeOptions, relayerDb, relayersConfig, testingMode, redirectRpc, bundlingMode, metricsOptions, version, } = opts;
        let { peerId } = opts;
        if (!peerId) {
            const enr = (_a = nodeOptions.network.discv5) === null || _a === void 0 ? void 0 : _a.enr;
            peerId = await enr.peerId();
        }
        let executor;
        let nodeApi = null;
        const metrics = metricsOptions.enable
            ? createMetrics({ p2p: true }, logger)
            : null;
        const getNodeApi = () => nodeApi;
        if (relayersConfig.testingMode) {
            metrics === null || metrics === void 0 ? void 0 : metrics.addChain(1337);
            executor = new Executor({
                chainId: 1337,
                db: relayerDb,
                config: relayersConfig,
                logger: logger,
                getNodeApi,
                bundlingMode,
                metrics: (metrics === null || metrics === void 0 ? void 0 : metrics.chains[1337]) || null,
                version,
            });
        }
        else {
            metrics === null || metrics === void 0 ? void 0 : metrics.addChain(relayersConfig.chainId);
            executor = new Executor({
                chainId: relayersConfig.chainId,
                db: relayerDb,
                config: relayersConfig,
                logger: logger,
                getNodeApi,
                bundlingMode,
                metrics: (metrics === null || metrics === void 0 ? void 0 : metrics.chains[relayersConfig.chainId]) || null,
                version,
            });
        }
        const network = await Network.init({
            opts: nodeOptions.network,
            relayersConfig: relayersConfig,
            peerId: peerId,
            peerStoreDir: nodeOptions.network.dataDir,
            executor, // ok: is null at the moment
            metrics: (metrics === null || metrics === void 0 ? void 0 : metrics.chains) || null,
        });
        const syncService = new SyncService({
            network,
            metrics: (metrics === null || metrics === void 0 ? void 0 : metrics.chains) || null,
            executor,
            executorConfig: relayersConfig,
        });
        nodeApi = getApi({ network });
        await relayerDb.start();
        const server = await Server.init({
            ...nodeOptions.api,
            host: nodeOptions.api.address,
        });
        metricsOptions.enable
            ? await getHttpMetricsServer(metricsOptions.port, metricsOptions.host, metrics.registry, logger)
            : null;
        const bundler = new ApiApp({
            server: server,
            config: relayersConfig,
            testingMode,
            redirectRpc,
            executor,
        });
        return new BundlerNode({
            network,
            server,
            bundler,
            nodeApi,
            executor,
            syncService,
        });
    }
    async start() {
        await this.network.start();
        await this.server.listen();
    }
    /**
     * Stop beacon node and its sub-components.
     */
    async close() {
        if (this.status === BundlerNodeStatus.started) {
            this.status = BundlerNodeStatus.closing;
            this.syncService.close();
            await this.network.stop();
            this.status = BundlerNodeStatus.closed;
        }
    }
}
//# sourceMappingURL=index.js.map