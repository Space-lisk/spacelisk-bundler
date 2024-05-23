import { ExecutorEvent } from "../../../executor/lib/services/index.js";
import RpcError from "../../../types/lib/api/errors/rpc-error.js";
import * as RpcErrorCodes from "../../../types/lib/api/errors/rpc-error-codes.js";
export class SubscriptionApi {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    subscribe(socket, event) {
        switch (event) {
            case ExecutorEvent.pendingUserOps: {
                return this.subscriptionService.listenPendingUserOps(socket);
            }
            case ExecutorEvent.submittedUserOps: {
                return this.subscriptionService.listenSubmittedUserOps(socket);
            }
            case ExecutorEvent.onChainUserOps: {
                return this.subscriptionService.listenOnChainUserOps(socket);
            }
            case ExecutorEvent.ping: {
                return this.subscriptionService.listenPing(socket);
            }
            default: {
                throw new RpcError(`Event ${event} not supported`, RpcErrorCodes.METHOD_NOT_FOUND);
            }
        }
    }
    unsubscribe(socket, id) {
        this.subscriptionService.unsubscribe(socket, id);
    }
}
//# sourceMappingURL=subscription.js.map