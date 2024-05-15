import { homedir } from "node:os";
import { options as apiOptions } from "./bundlerOptions/api.js";
import { options as networkOptions, } from "./bundlerOptions/network.js";
import { options as executorOptions, } from "./bundlerOptions/executor.js";
import { options as metricsOptions, } from "./bundlerOptions/metrics.js";
const __dirname = process.cwd();
export const defaultNetwork = "goerli";
export const defaultNetworksFile = "config.json";
const globalSingleOptions = {
    configFile: {
        description: "Location of the configuration file used by Skandha",
        type: "string",
        default: `${__dirname}/config.json`,
    },
    dataDir: {
        description: "Location of the data directory used by Skandha",
        type: "string",
        default: `${homedir()}/.skandha/db/`,
    },
    testingMode: {
        description: "Run bundler in testing mode (For testing against test suite)",
        type: "boolean",
        default: false,
    },
    unsafeMode: {
        description: "Run bundler in unsafe mode (Bypass opcode & stake check)",
        type: "boolean",
        default: false,
    },
    redirectRpc: {
        description: "Redirect RPC calls to underlying ETH1 client",
        type: "boolean",
        default: false,
    },
};
export const globalOptions = {
    ...globalSingleOptions,
    ...apiOptions,
    ...networkOptions,
    ...executorOptions,
    ...metricsOptions,
};
export const standaloneGlobalOptions = {
    ...globalSingleOptions,
    ...apiOptions,
    ...executorOptions,
    ...metricsOptions,
};
//# sourceMappingURL=globalOptions.js.map