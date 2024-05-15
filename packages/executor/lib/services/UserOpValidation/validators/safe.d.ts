import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { providers } from "ethers";
import { Logger } from "types/lib";
import { NetworkConfig, UserOpValidationResult } from "../../../interfaces";
import { ReputationService } from "../../ReputationService";
import { Skandha } from "../../../modules";
import { Config } from "../../../config";
export declare class SafeValidationService {
    private skandhaUtils;
    private provider;
    private reputationService;
    private chainId;
    private config;
    private networkConfig;
    private logger;
    private gethTracer;
    constructor(skandhaUtils: Skandha, provider: providers.Provider, reputationService: ReputationService, chainId: number, config: Config, networkConfig: NetworkConfig, logger: Logger);
    validateSafely(userOp: UserOperationStruct, entryPoint: string, codehash?: string): Promise<UserOpValidationResult>;
    private validateOpcodesAndStake;
}
//# sourceMappingURL=safe.d.ts.map