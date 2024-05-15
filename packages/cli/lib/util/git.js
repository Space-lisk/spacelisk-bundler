import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const gitDataPath = path.resolve(__dirname, "../../.git-data.json");
/** Writes a persistent git data file. */
export function writeGitDataFile(gitData) {
    fs.writeFileSync(gitDataPath, JSON.stringify(gitData, null, 2));
}
/** Reads the persistent git data file. */
export function readGitDataFile() {
    return JSON.parse(fs.readFileSync(gitDataPath, "utf8"));
}
export function readAndGetGitData() {
    var _a, _b;
    try {
        // Gets git data containing current branch and commit info from persistent file.
        let persistedGitData;
        try {
            persistedGitData = readGitDataFile();
        }
        catch (e) {
            persistedGitData = {};
        }
        const currentGitData = getGitData();
        return {
            // If the CLI is run from source, prioritze current git data
            // over `.git-data.json` file, which might be stale here.
            branch: currentGitData.branch && currentGitData.branch.length > 0
                ? currentGitData.branch
                : (_a = persistedGitData.branch) !== null && _a !== void 0 ? _a : "",
            commit: currentGitData.commit && currentGitData.commit.length > 0
                ? currentGitData.commit
                : (_b = persistedGitData.commit) !== null && _b !== void 0 ? _b : "",
        };
    }
    catch (e) {
        return {
            branch: "",
            commit: "",
        };
    }
}
/** Gets git data containing current branch and commit info from CLI. */
export function getGitData() {
    return {
        branch: getBranch(),
        commit: getCommit(),
    };
}
/** Tries to get branch from git CLI. */
export function getBranch() {
    try {
        return shellSilent("git rev-parse --abbrev-ref HEAD");
    }
    catch (e) {
        return "";
    }
}
/** Tries to get commit from git from git CLI. */
export function getCommit() {
    try {
        return shellSilent("git rev-parse --verify HEAD");
    }
    catch (e) {
        return "";
    }
}
/** Silent shell that won't pollute stdout, or stderr */
function shellSilent(cmd) {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] })
        .toString()
        .trim();
}
//# sourceMappingURL=git.js.map