import { ssz } from "../../../../types/lib/index.js";
import { ContextBytesType, Encoding, } from "../types.js";
/* eslint-disable @typescript-eslint/naming-convention */
const MetadataCommon = {
    method: "metadata",
    encoding: Encoding.SSZ_SNAPPY,
    requestType: () => null,
    inboundRateLimits: {
        // Rationale: https://github.com/sigp/lighthouse/blob/bf533c8e42cc73c35730e285c21df8add0195369/beacon_node/lighthouse_network/src/rpc/mod.rs#L118-L130
        byPeer: { quota: 2, quotaTimeMs: 5000 },
    },
};
export const Metadata = (modules, handler) => {
    return {
        ...MetadataCommon,
        version: 1,
        handler,
        responseType: () => ssz.Metadata,
        contextBytes: { type: ContextBytesType.Empty },
    };
};
//# sourceMappingURL=Metadata.js.map