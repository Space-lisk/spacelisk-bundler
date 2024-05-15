import publishVerifiedUserOperation from "./publishVerifiedUserOperation.js";
import publishVerifiedUserOperationJSON from "./publishVerifiedUserOperationJSON.js";
export function getApi(modules) {
    return {
        publishVerifiedUserOperation: publishVerifiedUserOperation(modules),
        publishVerifiedUserOperationJSON: publishVerifiedUserOperationJSON(modules),
        getPeers() {
            return modules.network.getConnectedPeers().map(peerId => {
                return {
                    cid: peerId.toCID().toString(),
                    str: peerId.toString(),
                    type: peerId.type,
                };
            });
        }
    };
}
//# sourceMappingURL=index.js.map