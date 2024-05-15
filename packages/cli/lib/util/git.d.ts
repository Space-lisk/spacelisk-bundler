/** Git data type used to construct version information string and persistence. */
export type GitData = {
    branch: string;
    commit: string;
};
export declare const gitDataPath: string;
/** Writes a persistent git data file. */
export declare function writeGitDataFile(gitData: GitData): void;
/** Reads the persistent git data file. */
export declare function readGitDataFile(): GitData;
export declare function readAndGetGitData(): GitData;
/** Gets git data containing current branch and commit info from CLI. */
export declare function getGitData(): GitData;
/** Tries to get branch from git CLI. */
export declare function getBranch(): string;
/** Tries to get commit from git from git CLI. */
export declare function getCommit(): string;
//# sourceMappingURL=git.d.ts.map