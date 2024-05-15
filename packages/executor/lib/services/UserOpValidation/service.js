import { BigNumber } from "ethers";
import RpcError from "types/lib/api/errors/rpc-error.js";
import * as RpcErrorCodes from "types/lib/api/errors/rpc-error-codes.js";
import { EstimationService, SafeValidationService, UnsafeValidationService, } from "./validators/index.js";
export class UserOpValidationService {
    constructor(skandhaUtils, provider, reputationService, chainId, config, logger) {
        this.skandhaUtils = skandhaUtils;
        this.provider = provider;
        this.reputationService = reputationService;
        this.chainId = chainId;
        this.config = config;
        this.logger = logger;
        const networkConfig = config.getNetworkConfig();
        this.networkConfig = networkConfig;
        this.estimationService = new EstimationService(this.provider, this.networkConfig, this.logger);
        this.safeValidationService = new SafeValidationService(this.skandhaUtils, this.provider, this.reputationService, this.chainId, this.config, this.networkConfig, this.logger);
        this.unsafeValidationService = new UnsafeValidationService(this.provider, this.networkConfig, this.logger);
    }
    async validateForEstimation(userOp, entryPoint) {
        if (this.networkConfig.entryPointForwarder.length > 2) {
            return await this.estimationService.estimateUserOpWithForwarder(userOp, entryPoint);
        }
        return await this.estimationService.estimateUserOp(userOp, entryPoint);
    }
    async validateForEstimationWithSignature(userOp, entryPoint) {
        if (this.networkConfig.entryPointForwarder.length > 2) {
            return await this.unsafeValidationService.validateUnsafelyWithForwarder(userOp, entryPoint);
        }
        return await this.unsafeValidationService.validateUnsafely(userOp, entryPoint);
    }
    async simulateValidation(userOp, entryPoint, codehash) {
        if (this.config.unsafeMode) {
            if (this.networkConfig.entryPointForwarder.length > 2) {
                return await this.unsafeValidationService.validateUnsafelyWithForwarder(userOp, entryPoint);
            }
            return await this.unsafeValidationService.validateUnsafely(userOp, entryPoint);
        }
        return await this.safeValidationService.validateSafely(userOp, entryPoint, codehash);
    }
    async validateGasFee(userOp) {
        const block = await this.provider.getBlock("latest");
        const { baseFeePerGas } = block;
        let { maxFeePerGas, maxPriorityFeePerGas } = userOp;
        maxFeePerGas = BigNumber.from(maxFeePerGas);
        maxPriorityFeePerGas = BigNumber.from(maxPriorityFeePerGas);
        if (!baseFeePerGas) {
            if (!maxFeePerGas.eq(maxPriorityFeePerGas)) {
                throw new RpcError("maxFeePerGas must be equal to maxPriorityFeePerGas", RpcErrorCodes.INVALID_USEROP);
            }
            return true;
        }
        if (maxFeePerGas.lt(baseFeePerGas)) {
            throw new RpcError("maxFeePerGas must be greater or equal to baseFee", RpcErrorCodes.INVALID_USEROP);
        }
        return true;
    }
    async binarySearchVGL(userOp, entryPoint) {
        if (this.config.unsafeMode) {
            return this.estimationService.binarySearchVGL(userOp, entryPoint);
        }
        return this.estimationService.binarySearchVGLSafe(userOp, entryPoint);
    }
    async binarySearchCGL(userOp, entryPoint) {
        if (this.config.unsafeMode) {
            return userOp; // CGL search not supported in unsafeMode
        }
        return this.estimationService.binarySearchCGLSafe(userOp, entryPoint);
    }
}
//# sourceMappingURL=service.js.map