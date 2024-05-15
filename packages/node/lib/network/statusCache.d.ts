import { ts } from "types/lib";
import { ReqRespHandlers } from "./reqresp/handlers";
export interface StatusCache {
    get(): Promise<ts.Status>;
}
export declare class LocalStatusCache implements StatusCache {
    private reqRespHandlers;
    private cached;
    private lastUpdatedTime;
    constructor(reqRespHandlers: ReqRespHandlers, cached: ts.Status);
    get(): Promise<ts.Status>;
}
//# sourceMappingURL=statusCache.d.ts.map