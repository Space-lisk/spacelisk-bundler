/// <reference types="node" />
import EventEmitter from "node:events";
import { WebSocket } from "ws";
import StrictEventEmitter from "strict-event-emitter-types";
import { Logger } from "types/lib";
import { MempoolEntry } from "../entities/MempoolEntry";
export declare enum ExecutorEvent {
    pendingUserOps = "pendingUserOps",// user ops that are in the mempool
    submittedUserOps = "submittedUserOps",// user ops submitted onchain, but not yet settled
    onChainUserOps = "onChainUserOps",// user ops found onchain
    ping = "ping"
}
export type ExecutorEvents = {
    [ExecutorEvent.pendingUserOps]: (entry: MempoolEntry) => void;
    [ExecutorEvent.submittedUserOps]: (entry: MempoolEntry) => void;
    [ExecutorEvent.onChainUserOps]: (entry: MempoolEntry) => void;
    [ExecutorEvent.ping]: () => void;
};
export type IExecutorEventBus = StrictEventEmitter<EventEmitter, ExecutorEvents>;
declare const ExecutorEventBus_base: new () => IExecutorEventBus;
export declare class ExecutorEventBus extends ExecutorEventBus_base {
}
export declare class SubscriptionService {
    private eventBus;
    private logger;
    constructor(eventBus: ExecutorEventBus, logger: Logger);
    private events;
    private listeners;
    listenPendingUserOps(socket: WebSocket): string;
    listenSubmittedUserOps(socket: WebSocket): string;
    listenOnChainUserOps(socket: WebSocket): string;
    listenPing(socket: WebSocket): string;
    unsubscribe(socket: WebSocket, id: string): void;
    onPendingUserOps(entry: MempoolEntry): void;
    onSubmittedUserOps(entry: MempoolEntry): void;
    onOnChainUserOps(entry: MempoolEntry): void;
    onPing(): void;
    private listen;
    private propagate;
    private generateEventId;
}
export {};
//# sourceMappingURL=SubscriptionService.d.ts.map