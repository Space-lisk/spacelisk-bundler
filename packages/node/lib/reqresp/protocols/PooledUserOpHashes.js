import { ssz } from "types/lib/index.js";
import { ContextBytesType, Encoding, } from "../types.js";
export const PooledUserOpHashes = (modules, handler) => {
    return {
        method: "pooled_user_op_hashes",
        version: 1,
        encoding: Encoding.SSZ_SNAPPY,
        requestType: () => ssz.PooledUserOpHashesRequest,
        responseType: () => ssz.PooledUserOpHashes,
        contextBytes: { type: ContextBytesType.Empty },
        handler,
        inboundRateLimits: {
            byPeer: { quota: 5, quotaTimeMs: 15000 },
        },
    };
};
//# sourceMappingURL=PooledUserOpHashes.js.map