export default function api(modules) {
    return async function publishVerifiedUserOperation(userOp, mempool) {
        await modules.network.publishVerifiedUserOperation(userOp, mempool);
    };
}
//# sourceMappingURL=publishVerifiedUserOperation.js.map