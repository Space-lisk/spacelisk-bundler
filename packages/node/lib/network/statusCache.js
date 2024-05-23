import { now } from "../../../executor/lib/utils/index.js";
export class LocalStatusCache {
    constructor(reqRespHandlers, cached) {
        this.reqRespHandlers = reqRespHandlers;
        this.cached = cached;
        this.lastUpdatedTime = 0;
        this.lastUpdatedTime = now();
    }
    async get() {
        if (this.lastUpdatedTime - now() < 5000) { // 5 seconds 
            return this.cached;
        }
        try {
            for await (const statusEncoded of this.reqRespHandlers.onStatus()) {
                this.lastUpdatedTime = now();
                return this.cached = statusEncoded.data;
            }
        }
        catch (err) { }
        ;
        return this.cached;
    }
}
//# sourceMappingURL=statusCache.js.map