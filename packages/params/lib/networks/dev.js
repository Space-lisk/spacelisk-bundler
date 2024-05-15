import { fromHexString as b } from "@chainsafe/ssz";
import { serializeMempoolId } from "../utils/index.js";
export const devNetworkConfig = {
    CHAIN_ID: 1337,
    ENTRY_POINT_CONTRACT: [b("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789")],
    CANONICAL_MEMPOOL: serializeMempoolId("Qmf7P3CuhzSbpJa8LqXPwRzfPqsvoQ6RG7aXvthYTzGxb2"),
};
//# sourceMappingURL=dev.js.map