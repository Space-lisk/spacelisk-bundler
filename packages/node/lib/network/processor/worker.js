import { NetworkEvent } from "../events.js";
import { getGossipHandlers } from "./gossipHandlers.js";
import { getGossipValidatorFn } from "./gossipValidatorFn.js";
export class NetworkWorker {
    constructor(modules) {
        var _a;
        this.events = modules.events;
        this.gossipValidatorFn = getGossipValidatorFn((_a = modules.gossipHandlers) !== null && _a !== void 0 ? _a : getGossipHandlers(modules), modules);
    }
    async processPendingGossipsubMessage(message) {
        message.startProcessUnixSec = Date.now() / 1000;
        const acceptance = await this.gossipValidatorFn(message.topic, message.msg, message.propagationSource.toString(), message.seenTimestampSec);
        // Use setTimeout to yield to the macro queue
        // This is mostly due to too many attestation messages, and a gossipsub RPC may
        // contain multiple of them. This helps avoid the I/O lag issue.
        setTimeout(() => this.events.emit(NetworkEvent.gossipMessageValidationResult, message.msgId, message.propagationSource, acceptance), 0);
    }
}
//# sourceMappingURL=worker.js.map