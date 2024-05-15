export class GossipValidationError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
export var GossipAction;
(function (GossipAction) {
    GossipAction["IGNORE"] = "IGNORE";
    GossipAction["REJECT"] = "REJECT";
})(GossipAction || (GossipAction = {}));
export class GossipActionError {
    constructor(action, type) {
        this.type = type;
        this.action = action;
    }
}
export var GossipErrorCode;
(function (GossipErrorCode) {
    GossipErrorCode[GossipErrorCode["INVALID_CHAIN_ID"] = 10000] = "INVALID_CHAIN_ID";
    GossipErrorCode[GossipErrorCode["INVALID_ENTRY_POINT"] = 10001] = "INVALID_ENTRY_POINT";
    GossipErrorCode[GossipErrorCode["OUTDATED_USER_OP"] = 10002] = "OUTDATED_USER_OP";
})(GossipErrorCode || (GossipErrorCode = {}));
//# sourceMappingURL=errors.js.map