var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsDefined, IsEthereumAddress, IsObject, IsOptional, IsString, ValidateNested, } from "class-validator";
import { Type } from "class-transformer";
import { IsBigNumber, IsCallData } from "../utils/index.js";
export class EstimateUserOperationStruct {
}
__decorate([
    IsEthereumAddress()
], EstimateUserOperationStruct.prototype, "sender", void 0);
__decorate([
    IsBigNumber()
], EstimateUserOperationStruct.prototype, "nonce", void 0);
__decorate([
    IsString(),
    IsCallData()
], EstimateUserOperationStruct.prototype, "initCode", void 0);
__decorate([
    IsString()
], EstimateUserOperationStruct.prototype, "callData", void 0);
__decorate([
    IsString()
], EstimateUserOperationStruct.prototype, "signature", void 0);
__decorate([
    IsBigNumber(),
    IsOptional()
], EstimateUserOperationStruct.prototype, "verificationGasLimit", void 0);
__decorate([
    IsBigNumber(),
    IsOptional()
], EstimateUserOperationStruct.prototype, "preVerificationGas", void 0);
__decorate([
    IsBigNumber(),
    IsOptional()
], EstimateUserOperationStruct.prototype, "maxFeePerGas", void 0);
__decorate([
    IsBigNumber(),
    IsOptional()
], EstimateUserOperationStruct.prototype, "maxPriorityFeePerGas", void 0);
__decorate([
    IsString(),
    IsCallData(),
    IsOptional()
], EstimateUserOperationStruct.prototype, "paymasterAndData", void 0);
__decorate([
    IsBigNumber(),
    IsOptional()
], EstimateUserOperationStruct.prototype, "callGasLimit", void 0);
export class EstimateUserOperationGasArgs {
}
__decorate([
    IsDefined(),
    IsObject(),
    ValidateNested(),
    Type(() => EstimateUserOperationStruct)
], EstimateUserOperationGasArgs.prototype, "userOp", void 0);
__decorate([
    IsEthereumAddress()
], EstimateUserOperationGasArgs.prototype, "entryPoint", void 0);
//# sourceMappingURL=EstimateUserOperation.dto.js.map