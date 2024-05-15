import { IEntryPoint__factory } from "types/lib/executor/contracts/index.js";
import { BigNumber, Contract } from "ethers";
import { nonGethErrorHandler, parseErrorResult } from "../utils.js";
export class UnsafeValidationService {
    constructor(provider, networkConfig, logger) {
        this.provider = provider;
        this.networkConfig = networkConfig;
        this.logger = logger;
    }
    async validateUnsafely(userOp, entryPoint) {
        const { validationGasLimit } = this.networkConfig;
        const entryPointContract = IEntryPoint__factory.connect(entryPoint, this.provider);
        const errorResult = await entryPointContract.callStatic
            .simulateValidation(userOp, {
            gasLimit: validationGasLimit,
        })
            .catch((e) => nonGethErrorHandler(entryPointContract, e));
        return parseErrorResult(userOp, errorResult);
    }
    async validateUnsafelyWithForwarder(userOp, entryPoint) {
        const forwarderABI = ["function forward(address, bytes)"];
        const gasLimit = BigNumber.from(this.networkConfig.validationGasLimit).add(100000);
        const entryPointContract = IEntryPoint__factory.connect(entryPoint, this.provider);
        const validationData = entryPointContract.interface.encodeFunctionData("simulateValidation", [userOp]);
        const forwarder = new Contract(this.networkConfig.entryPointForwarder, forwarderABI, this.provider);
        const data = await this.provider.call({
            to: this.networkConfig.entryPointForwarder,
            data: forwarder.interface.encodeFunctionData("forward", [
                entryPoint,
                validationData,
            ]),
            gasLimit,
        });
        const error = entryPointContract.interface.parseError(data);
        return parseErrorResult(userOp, {
            errorArgs: error.args,
            errorName: error.name,
        });
    }
}
//# sourceMappingURL=unsafe.js.map