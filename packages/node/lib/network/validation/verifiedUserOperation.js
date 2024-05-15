import { toHexString } from "@chainsafe/ssz";
import { GossipErrorCode, GossipValidationError } from "../gossip/errors.js";
export async function validateGossipVerifiedUserOperation(relayersConfig, verifiedUserOperation) {
    const entryPoint = toHexString(verifiedUserOperation.entry_point);
    const blockHash = Number(verifiedUserOperation.verified_at_block_hash);
    if (!relayersConfig.isEntryPointSupported(entryPoint)) {
        throw new GossipValidationError(GossipErrorCode.INVALID_ENTRY_POINT, "Entrypoint is not supported");
    }
    const networkProvider = relayersConfig.getNetworkProvider();
    const blockNumber = await (networkProvider === null || networkProvider === void 0 ? void 0 : networkProvider.getBlockNumber());
    if (blockNumber == null || blockHash + 20 < blockNumber) {
        throw new GossipValidationError(GossipErrorCode.OUTDATED_USER_OP, "Old user op");
    }
}
//# sourceMappingURL=verifiedUserOperation.js.map