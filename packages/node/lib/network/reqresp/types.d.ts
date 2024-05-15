import { ts } from "types/lib";
export declare enum ReqRespMethod {
    Status = "status",
    Goodbye = "goodbye",
    Ping = "ping",
    Metadata = "metadata",
    PooledUserOpHashes = "pooled_user_op_hashes",
    PooledUserOpsByHash = "pooled_user_ops_by_hash"
}
type RequestBodyByMethod = {
    [ReqRespMethod.Status]: ts.Status;
    [ReqRespMethod.Goodbye]: ts.Goodbye;
    [ReqRespMethod.Ping]: ts.Ping;
    [ReqRespMethod.Metadata]: null;
    [ReqRespMethod.PooledUserOpHashes]: ts.PooledUserOpHashesRequest;
    [ReqRespMethod.PooledUserOpsByHash]: ts.PooledUserOpsByHashRequest;
};
export type RequestTypedContainer = {
    [K in ReqRespMethod]: {
        method: K;
        body: RequestBodyByMethod[K];
    };
}[ReqRespMethod];
export declare enum Version {
    V1 = 1
}
export {};
//# sourceMappingURL=types.d.ts.map