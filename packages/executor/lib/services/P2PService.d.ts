import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { MempoolService } from "./MempoolService";
export type PooledUserOpHashesResponse = {
    next_cursor: number;
    hashes: string[];
};
export type PooledUseropsByHashResponse = UserOperationStruct[];
export declare class P2PService {
    private mempoolService;
    constructor(mempoolService: MempoolService);
    getPooledUserOpHashes(limit: number, offset: number): Promise<PooledUserOpHashesResponse>;
    getPooledUserOpsByHash(hashes: string[]): Promise<UserOperationStruct[]>;
    userOpByHash(hash: string): Promise<UserOperationStruct | null>;
    isNewOrReplacingUserOp(userOp: UserOperationStruct, entryPoint: string): Promise<boolean>;
}
//# sourceMappingURL=P2PService.d.ts.map