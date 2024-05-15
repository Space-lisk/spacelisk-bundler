import { standaloneGlobalOptions } from "../../options/index.js";
import { bundlerHandler } from "./handler.js";
export const standalone = {
    command: "standalone",
    describe: "Run a standalone bundler client",
    examples: [
        {
            command: "standalone",
            description: "Run a bundler client (without p2p) and connect to the goerli testnet",
        },
    ],
    options: standaloneGlobalOptions,
    handler: bundlerHandler,
};
//# sourceMappingURL=index.js.map