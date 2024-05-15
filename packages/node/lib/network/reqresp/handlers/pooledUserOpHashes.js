import { ssz } from "types/lib/index.js";
import { MAX_OPS_PER_REQUEST } from "types/lib/sszTypes.js";
import logger from "api/lib/logger.js";
import { userOpHashToBytes } from "params/lib/utils/userOp.js";
import { bytes32ToNumber, numberToBytes32 } from "params/lib/utils/cursor.js";
import { EncodedPayloadType } from "../../../reqresp/types.js";
export async function* onPooledUserOpHashes(executor, relayersConfig, req) {
    const pooledUserOpHashes = await executor.p2pService.getPooledUserOpHashes(MAX_OPS_PER_REQUEST, bytes32ToNumber(req.cursor));
    logger.debug(`Sending: ${JSON.stringify({
        next_cursor: pooledUserOpHashes.next_cursor,
        hashes: pooledUserOpHashes.hashes,
    }, undefined, 2)}`);
    const data = ssz.PooledUserOpHashes.defaultValue();
    data.next_cursor = numberToBytes32(pooledUserOpHashes.next_cursor);
    data.hashes = pooledUserOpHashes.hashes.map((hash) => userOpHashToBytes(hash));
    yield { type: EncodedPayloadType.ssz, data };
}
//# sourceMappingURL=pooledUserOpHashes.js.map