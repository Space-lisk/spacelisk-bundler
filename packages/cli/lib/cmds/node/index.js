import { globalOptions } from "../../options/index.js";
import { nodeHandler } from "./handler.js";
export const node = {
    command: "node",
    describe: "Quickly bootstrap a bundler node with p2p interface.",
    examples: [
        {
            command: "node --sepolia",
            description: "Start a skandha bundler node on sepolia network",
        },
    ],
    options: globalOptions,
    handler: nodeHandler,
};
//# sourceMappingURL=index.js.map