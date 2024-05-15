import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { providers } from "ethers";
import { Logger } from "types/lib";
import { NetworkConfig, UserOpValidationResult } from "../../../interfaces";
export declare class UnsafeValidationService {
    private provider;
    private networkConfig;
    private logger;
    constructor(provider: providers.Provider, networkConfig: NetworkConfig, logger: Logger);
    validateUnsafely(userOp: UserOperationStruct, entryPoint: string): Promise<UserOpValidationResult>;
    validateUnsafelyWithForwarder(userOp: UserOperationStruct, entryPoint: string): Promise<UserOpValidationResult>;
}
//# sourceMappingURL=unsafe.d.ts.map