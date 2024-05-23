import { defaultExecutorOptions } from "../../../../types/lib/options/executor.js";
export function parseArgs(args) {
    return {
        bundlingMode: args["executor.bundlingMode"],
    };
}
export const options = {
    "executor.bundlingMode": {
        type: "string",
        description: "Default bundling mode",
        default: defaultExecutorOptions.bundlingMode,
        group: "executor",
        demandOption: false,
    },
};
//# sourceMappingURL=executor.js.map