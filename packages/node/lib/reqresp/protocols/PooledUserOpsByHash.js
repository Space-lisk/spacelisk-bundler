import { ssz } from "types/lib/index.js";
import { ContextBytesType, Encoding, } from "../types.js";
export const PooledUserOpsByHash = (modules, handler) => {
    return {
        method: "pooled_user_ops_by_hash",
        version: 1,
        encoding: Encoding.SSZ_SNAPPY,
        requestType: () => ssz.PooledUserOpsByHashRequest,
        responseType: () => ssz.PooledUserOpsByHash,
        contextBytes: { type: ContextBytesType.Empty },
        handler,
        inboundRateLimits: {
            byPeer: { quota: 5, quotaTimeMs: 15000 },
        },
    };
};
//# sourceMappingURL=PooledUserOpsByHash.js.map