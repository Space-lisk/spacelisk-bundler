import logger from "api/lib/logger.js";
import { deserializeVerifiedUserOperation } from "params/lib/utils/userOp.js";
import { GossipType } from "../gossip/interface.js";
import { validateGossipVerifiedUserOperation } from "../validation/index.js";
import { GossipValidationError } from "../gossip/errors.js";
export function getGossipHandlers(modules) {
    const { relayersConfig, executor } = modules;
    async function validateVerifiedUserOperation(userOp, mempool, peerIdStr, seenTimestampSec) {
        logger.info({
            mempool,
            peerIdStr,
            seenTimestampSec,
        }, "Received gossip block");
        try {
            await validateGossipVerifiedUserOperation(relayersConfig, userOp);
            logger.debug("Validation successful");
            return true;
        }
        catch (err) {
            if (err instanceof GossipValidationError) {
                logger.debug(`${err.code}: ${err.message}`);
            }
            else {
                logger.debug(err);
            }
            return false;
        }
    }
    async function handleValidVerifiedUserOperation(verifiedUserOp, mempool, peerIdStr, seenTimestampSec) {
        var _a;
        const { entryPoint, userOp } = deserializeVerifiedUserOperation(verifiedUserOp);
        try {
            const isNewOrReplacing = await executor.p2pService.isNewOrReplacingUserOp(userOp, entryPoint);
            if (!isNewOrReplacing) {
                logger.debug(`[${userOp.sender}, ${userOp.nonce.toString()}] exists, skipping...`);
                return;
            }
            const userOpHash = await executor.eth.sendUserOperation({
                userOp,
                entryPoint,
            });
            logger.debug(`Processed userOp: ${userOpHash}`);
            if (modules.metrics) {
                (_a = modules.metrics[executor.chainId].useropsReceived) === null || _a === void 0 ? void 0 : _a.inc();
            }
        }
        catch (err) {
            logger.error(`Could not process userOp: ${err}`);
        }
        return;
    }
    return {
        [GossipType.user_operations]: async (userOp, topic, peerIdStr, seenTimestampSec) => {
            if (await validateVerifiedUserOperation(userOp, topic.mempool, peerIdStr, seenTimestampSec)) {
                await handleValidVerifiedUserOperation(userOp, topic.mempool, peerIdStr, seenTimestampSec);
            }
        },
    };
}
//# sourceMappingURL=gossipHandlers.js.map