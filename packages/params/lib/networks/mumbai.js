import { fromHexString as b } from "@chainsafe/ssz";
import { serializeMempoolId } from "../utils/index.js";
export const mumbaiNetworkConfig = {
    CHAIN_ID: 80001,
    ENTRY_POINT_CONTRACT: [b("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789")],
    CANONICAL_MEMPOOL: serializeMempoolId("QmcFZKUX9qoo3StwVycJTAhwdiqbEjcwNvQVK246p3z1rk"),
};
//# sourceMappingURL=mumbai.js.map