import { WebSocket } from "ws";
import { SubscriptionService, ExecutorEvent } from "executor/lib/services";
export declare class SubscriptionApi {
    private subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    subscribe(socket: WebSocket, event: ExecutorEvent): string;
    unsubscribe(socket: WebSocket, id: string): void;
}
//# sourceMappingURL=subscription.d.ts.map