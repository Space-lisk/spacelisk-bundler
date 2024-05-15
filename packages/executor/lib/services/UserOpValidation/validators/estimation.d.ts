import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { providers } from "ethers";
import { Logger } from "types/lib";
import { ExecutionResult, NetworkConfig } from "../../../interfaces";
export declare class EstimationService {
    private provider;
    private networkConfig;
    private logger;
    private gethTracer;
    constructor(provider: providers.Provider, networkConfig: NetworkConfig, logger: Logger);
    estimateUserOp(userOp: UserOperationStruct, entryPoint: string): Promise<ExecutionResult>;
    estimateUserOpWithForwarder(userOp: UserOperationStruct, entryPoint: string): Promise<ExecutionResult>;
    binarySearchVGL(userOp: UserOperationStruct, entryPoint: string): Promise<UserOperationStruct>;
    binarySearchVGLSafe(userOp: UserOperationStruct, entryPoint: string): Promise<UserOperationStruct>;
    binarySearchCGLSafe(userOp: UserOperationStruct, entryPoint: string): Promise<UserOperationStruct>;
    checkForOOG(userOp: UserOperationStruct, entryPoint: string): Promise<string>;
}
//# sourceMappingURL=estimation.d.ts.map