import { defaultMetricsOptions } from "types/lib/options/metrics.js";
export function parseArgs(args) {
    return {
        enable: args["metrics.enable"],
        host: args["metrics.host"],
        port: args["metrics.port"],
    };
}
export const options = {
    "metrics.enable": {
        type: "boolean",
        description: "Enable monitoring",
        default: defaultMetricsOptions.enable,
        group: "metrics",
        demandOption: false,
    },
    "metrics.host": {
        type: "string",
        description: "Metrics host",
        default: defaultMetricsOptions.host,
        group: "metrics",
        demandOption: false,
    },
    "metrics.port": {
        type: "number",
        description: "Metrics port",
        default: defaultMetricsOptions.port,
        group: "metrics",
        demandOption: false,
    },
};
//# sourceMappingURL=metrics.js.map