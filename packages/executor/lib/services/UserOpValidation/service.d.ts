import { providers } from "ethers";
import { Logger } from "types/lib";
import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { Config } from "../../config";
import { ExecutionResult, UserOpValidationResult } from "../../interfaces";
import { ReputationService } from "../ReputationService";
import { Skandha } from "../../modules";
export declare class UserOpValidationService {
    private skandhaUtils;
    private provider;
    private reputationService;
    private chainId;
    private config;
    private logger;
    private networkConfig;
    private estimationService;
    private safeValidationService;
    private unsafeValidationService;
    constructor(skandhaUtils: Skandha, provider: providers.Provider, reputationService: ReputationService, chainId: number, config: Config, logger: Logger);
    validateForEstimation(userOp: UserOperationStruct, entryPoint: string): Promise<ExecutionResult>;
    validateForEstimationWithSignature(userOp: UserOperationStruct, entryPoint: string): Promise<UserOpValidationResult>;
    simulateValidation(userOp: UserOperationStruct, entryPoint: string, codehash?: string): Promise<UserOpValidationResult>;
    validateGasFee(userOp: UserOperationStruct): Promise<boolean>;
    binarySearchVGL(userOp: UserOperationStruct, entryPoint: string): Promise<UserOperationStruct>;
    binarySearchCGL(userOp: UserOperationStruct, entryPoint: string): Promise<UserOperationStruct>;
}
//# sourceMappingURL=service.d.ts.map