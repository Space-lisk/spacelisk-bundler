import { defaultApiOptions } from "../../../../types/lib/options/api.js";
export function parseArgs(args) {
    return {
        address: args["api.address"],
        port: args["api.port"],
        cors: args["api.cors"],
        enableRequestLogging: args["api.enableRequestLogging"],
        ws: args["api.ws"],
        wsPort: args["api.wsPort"],
    };
}
export const options = {
    "api.cors": {
        type: "string",
        description: "Configures the Access-Control-Allow-Origin CORS header for HTTP API",
        default: defaultApiOptions.cors,
        group: "api",
        demandOption: false,
    },
    "api.address": {
        type: "string",
        description: "Set host for HTTP API",
        default: defaultApiOptions.address,
        group: "api",
        demandOption: false,
    },
    "api.port": {
        type: "number",
        description: "Set port for HTTP API",
        default: defaultApiOptions.port,
        group: "api",
        demandOption: false,
    },
    "api.enableRequestLogging": {
        type: "boolean",
        description: "Enable request logging",
        default: defaultApiOptions.enableRequestLogging,
        group: "api",
        demandOption: false,
    },
    "api.ws": {
        type: "boolean",
        description: "Enable websocket interface",
        default: defaultApiOptions.ws,
        group: "api",
        demandOption: false,
    },
    "api.wsPort": {
        type: "number",
        description: "Enable websocket interface",
        default: defaultApiOptions.wsPort,
        group: "api",
        demandOption: false,
    },
};
//# sourceMappingURL=api.js.map