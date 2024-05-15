export class P2PService {
    constructor(mempoolService) {
        this.mempoolService = mempoolService;
    }
    async getPooledUserOpHashes(limit, offset) {
        const entries = await this.mempoolService.getNewEntriesSorted(limit, offset);
        const hasMore = entries.length == limit;
        return {
            next_cursor: hasMore ? entries.length + offset : 0,
            hashes: entries
                .map((entry) => entry.userOpHash)
                .filter((hash) => hash && hash.length === 66),
        };
    }
    async getPooledUserOpsByHash(hashes) {
        const userOps = [];
        for (const hash of hashes) {
            const entry = await this.mempoolService.getEntryByHash(hash);
            if (entry) {
                userOps.push(entry.userOp);
            }
        }
        return userOps;
    }
    async userOpByHash(hash) {
        const entry = await this.mempoolService.getEntryByHash(hash);
        return entry ? entry.userOp : null;
    }
    async isNewOrReplacingUserOp(userOp, entryPoint) {
        try {
            return await this.mempoolService.validateUserOpReplaceability(userOp, entryPoint);
        }
        catch (err) {
            return false;
        }
    }
}
//# sourceMappingURL=P2PService.js.map