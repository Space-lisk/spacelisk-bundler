import os from "node:os";
import path from "node:path";
/**
 * Follows XDG Base Directory Specification
 * https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html#basics
 */
export function getDefaultDataDir(network) {
    const dataHome = process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share");
    return path.join(dataHome, "skandha", network);
}
//# sourceMappingURL=rootDir.js.map