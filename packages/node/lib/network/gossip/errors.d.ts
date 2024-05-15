export declare class GossipValidationError extends Error {
    code: string | number;
    constructor(code: string | number, message?: string);
}
export declare enum GossipAction {
    IGNORE = "IGNORE",
    REJECT = "REJECT"
}
export declare class GossipActionError<T extends {
    code: string;
}> {
    type: T;
    action: GossipAction;
    constructor(action: GossipAction, type: T);
}
export declare enum GossipErrorCode {
    INVALID_CHAIN_ID = 10000,
    INVALID_ENTRY_POINT = 10001,
    OUTDATED_USER_OP = 10002
}
//# sourceMappingURL=errors.d.ts.map