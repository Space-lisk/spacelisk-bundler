import { Server } from "../../../../api/lib/server.js";
import { ApiApp } from "../../../../api/lib/app.js";
import { Config } from "../../../../executor/lib/config.js";
import { Namespace, getNamespaceByValue, RocksDbController, LocalDbController, } from "../../../../db/lib/index.js";
import { Executor } from "../../../../executor/lib/executor.js";
import logger from "../../../../api/lib/logger.js";
import { createMetrics, getHttpMetricsServer } from "../../../../monitoring/lib/index.js";
import { mkdir, readFile } from "../../util/index.js";
import { getVersionData } from "../../util/version.js";
export async function bundlerHandler(args) {
    const { dataDir, testingMode, unsafeMode, redirectRpc, configFile } = args;
    //create the necessary directories
    mkdir(dataDir);
    logger.info("  ___                                            ___  ");
    logger.info(" (o o)                                          (o o) ");
    logger.info("(  V  ) Skandha - A modular typescript bundler (  V  )");
    logger.info("--m-m--------------------------------------------m-m--");
    logger.info(`Using the configFile from ${configFile}`);
    logger.info(`Initialised the dataDir at ${dataDir}`);
    logger.info("----- Running in STANDALONE MODE -----");
    let config;
    try {
        const networkConfig = readFile(configFile);
        config = await Config.init({
            config: networkConfig,
            testingMode,
            unsafeMode,
            redirectRpc,
        });
    }
    catch (err) {
        if (err instanceof Error && err.message.indexOf("chain id") > -1) {
            logger.error(err.message);
            return;
        }
        logger.debug("Config file not found. Proceeding with env vars...");
        config = await Config.init({
            config: null,
            testingMode,
            unsafeMode,
            redirectRpc,
        });
    }
    if (unsafeMode) {
        logger.warn("WARNING: Running in unsafe mode, skips opcode check and stake check");
    }
    if (redirectRpc) {
        logger.warn("WARNING: RPC redirecting is enabled, redirects RPC whitelisted calls to RPC");
    }
    let db;
    if (testingMode) {
        db = new LocalDbController(getNamespaceByValue(Namespace.userOps));
    }
    else {
        db = new RocksDbController(dataDir, getNamespaceByValue(Namespace.userOps));
        await db.start();
    }
    const server = await Server.init({
        enableRequestLogging: args["api.enableRequestLogging"],
        port: args["api.port"],
        host: args["api.address"],
        cors: args["api.cors"],
        ws: args["api.ws"],
        wsPort: args["api.wsPort"],
    });
    const metrics = args["metrics.enable"]
        ? createMetrics({ p2p: false }, logger)
        : null;
    const version = getVersionData();
    let executor;
    if (config.testingMode) {
        metrics === null || metrics === void 0 ? void 0 : metrics.addChain(1337);
        executor = new Executor({
            chainId: 1337,
            db: db,
            config: config,
            logger: logger,
            bundlingMode: args["executor.bundlingMode"],
            metrics: (metrics === null || metrics === void 0 ? void 0 : metrics.chains[1337]) || null,
            version,
        });
    }
    else {
        metrics === null || metrics === void 0 ? void 0 : metrics.addChain(config.chainId);
        executor = new Executor({
            chainId: config.chainId,
            db: db,
            config: config,
            logger: logger,
            bundlingMode: args["executor.bundlingMode"],
            metrics: (metrics === null || metrics === void 0 ? void 0 : metrics.chains[config.chainId]) || null,
            version,
        });
    }
    args["metrics.enable"]
        ? await getHttpMetricsServer(args["metrics.port"], args["metrics.host"], metrics.registry, logger)
        : null;
    new ApiApp({
        server: server,
        config: config,
        testingMode,
        redirectRpc,
        executor,
    });
    await server.listen();
}
//# sourceMappingURL=handler.js.map