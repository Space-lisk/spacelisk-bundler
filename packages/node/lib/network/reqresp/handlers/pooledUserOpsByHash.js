import { serializeUserOp, userOpHashToString } from "params/lib/utils/userOp.js";
import logger from "api/lib/logger.js";
import { EncodedPayloadType } from "../../../reqresp/types.js";
export async function* onPooledUserOpsByHash(executor, relayersConfig, req, metrics) {
    var _a;
    const userOpHashes = req.hashes.map((hash) => userOpHashToString(hash));
    logger.debug(`UserOpsByHash, received hashes: ${userOpHashes.join(", ")}`);
    const userOps = await executor.p2pService.getPooledUserOpsByHash(userOpHashes);
    logger.debug(`UserOpsByHash, found userops: ${userOps.length}`);
    const sszUserOps = userOps.map((userOp) => serializeUserOp(userOp));
    if (metrics)
        (_a = metrics[relayersConfig.chainId].useropsSent) === null || _a === void 0 ? void 0 : _a.inc(userOps.length);
    yield {
        type: EncodedPayloadType.ssz,
        data: sszUserOps,
    };
}
//# sourceMappingURL=pooledUserOpsByHash.js.map