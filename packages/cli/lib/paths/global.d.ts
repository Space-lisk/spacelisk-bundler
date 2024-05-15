import { IGlobalArgs } from "../options";
export interface IGlobalPaths {
    dataDir: string;
}
/**
 * Defines the path structure of the globally used files
 *
 * ```bash
 * $dataDir
 * └── $networksFile
 * ```
 */
export declare function getGlobalPaths(args: Partial<IGlobalArgs>, network: string): IGlobalPaths;
export declare const defaultGlobalPaths: IGlobalPaths;
//# sourceMappingURL=global.d.ts.map