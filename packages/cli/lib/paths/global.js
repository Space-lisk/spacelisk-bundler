import { getDefaultDataDir } from "./rootDir.js";
/**
 * Defines the path structure of the globally used files
 *
 * ```bash
 * $dataDir
 * └── $networksFile
 * ```
 */
export function getGlobalPaths(args, network) {
    // Set dataDir to network name iff dataDir is not set explicitly
    const dataDir = args.dataDir || getDefaultDataDir(network);
    return {
        dataDir,
    };
}
export const defaultGlobalPaths = getGlobalPaths({ dataDir: "$dataDir" }, "$networks");
//# sourceMappingURL=global.js.map