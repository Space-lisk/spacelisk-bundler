import { toVerifiedUserOperation } from "../../../params/lib/utils/userOp.js";
export default function api(modules) {
    return async function publishVerifiedUserOperationJSON(entryPoint, userOp, blockHash, mempool) {
        const VerifiedUserOperation = toVerifiedUserOperation(entryPoint, userOp, blockHash);
        await modules.network.publishVerifiedUserOperation(VerifiedUserOperation, mempool);
    };
}
//# sourceMappingURL=publishVerifiedUserOperationJSON.js.map