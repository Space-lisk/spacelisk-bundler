export default class RpcError extends Error {
    readonly code?: number | undefined;
    readonly data: any;
    constructor(msg: string, code?: number | undefined, data?: any);
}
//# sourceMappingURL=rpc-error.d.ts.map