import EventEmitter from "node:events";
import { WebSocket } from "ws";
import { ethers } from "ethers";
import { deepHexlify } from "utils/lib/hexlify.js";
import { MempoolEntryStatus } from "types/lib/executor/index.js";
export var ExecutorEvent;
(function (ExecutorEvent) {
    ExecutorEvent["pendingUserOps"] = "pendingUserOps";
    ExecutorEvent["submittedUserOps"] = "submittedUserOps";
    ExecutorEvent["onChainUserOps"] = "onChainUserOps";
    ExecutorEvent["ping"] = "ping";
})(ExecutorEvent || (ExecutorEvent = {}));
export class ExecutorEventBus extends EventEmitter {
}
export class SubscriptionService {
    constructor(eventBus, logger) {
        this.eventBus = eventBus;
        this.logger = logger;
        this.events = {
            [ExecutorEvent.pendingUserOps]: new Set(),
            [ExecutorEvent.submittedUserOps]: new Set(),
            [ExecutorEvent.onChainUserOps]: new Set(),
            [ExecutorEvent.ping]: new Set(),
        };
        this.listeners = {};
        this.eventBus.on(ExecutorEvent.pendingUserOps, this.onPendingUserOps.bind(this));
        this.eventBus.on(ExecutorEvent.submittedUserOps, this.onSubmittedUserOps.bind(this));
        this.eventBus.on(ExecutorEvent.onChainUserOps, this.onOnChainUserOps.bind(this));
    }
    listenPendingUserOps(socket) {
        return this.listen(socket, ExecutorEvent.pendingUserOps);
    }
    listenSubmittedUserOps(socket) {
        return this.listen(socket, ExecutorEvent.submittedUserOps);
    }
    listenOnChainUserOps(socket) {
        return this.listen(socket, ExecutorEvent.onChainUserOps);
    }
    listenPing(socket) {
        return this.listen(socket, ExecutorEvent.ping);
    }
    unsubscribe(socket, id) {
        delete this.listeners[id];
        for (const event in ExecutorEvent) {
            this.events[event].delete(id);
        }
        this.logger.debug(`${id} unsubscribed`);
    }
    onPendingUserOps(entry) {
        const { userOp, userOpHash, entryPoint, prefund, submittedTime } = entry;
        this.propagate(ExecutorEvent.pendingUserOps, {
            userOp,
            userOpHash,
            entryPoint,
            prefund,
            submittedTime,
            status: "pending",
        });
    }
    onSubmittedUserOps(entry) {
        var _a;
        const { userOp, userOpHash, entryPoint, transaction, revertReason } = entry;
        const status = (_a = Object.keys(MempoolEntryStatus).find((status) => entry.status ===
            MempoolEntryStatus[status])) !== null && _a !== void 0 ? _a : "New";
        this.propagate(ExecutorEvent.submittedUserOps, {
            userOp,
            userOpHash,
            entryPoint,
            transaction,
            status,
            revertReason: revertReason,
        });
    }
    onOnChainUserOps(entry) {
        const { userOp, userOpHash, entryPoint, actualTransaction } = entry;
        this.propagate(ExecutorEvent.onChainUserOps, {
            userOp,
            userOpHash,
            entryPoint,
            transaction: actualTransaction,
            status: "onChain",
        });
    }
    onPing() {
        this.propagate(ExecutorEvent.ping);
    }
    listen(socket, event) {
        const id = this.generateEventId();
        this.listeners[id] = socket;
        this.events[event].add(id);
        this.logger.debug(`${id} subscribed for ${event}`);
        return id;
    }
    propagate(event, data) {
        if (data != undefined) {
            data = deepHexlify(data);
        }
        for (const id of this.events[event]) {
            const response = {
                jsonrpc: "2.0",
                method: "skandha_subscription",
                params: {
                    subscription: id,
                    result: data,
                },
            };
            try {
                const socket = this.listeners[id];
                if (socket.readyState === WebSocket.CLOSED ||
                    socket.readyState === WebSocket.CLOSING) {
                    this.unsubscribe(socket, id);
                    return;
                }
                this.listeners[id].send(JSON.stringify(response));
            }
            catch (err) {
                this.logger.error(err, `Could not send event. Id: ${id}`);
            }
        }
    }
    generateEventId() {
        const id = ethers.utils.hexlify(ethers.utils.randomBytes(16));
        for (const event in ExecutorEvent) {
            if (this.events[event].has(id)) {
                // retry if id already exists
                return this.generateEventId();
            }
        }
        return id;
    }
}
//# sourceMappingURL=SubscriptionService.js.map