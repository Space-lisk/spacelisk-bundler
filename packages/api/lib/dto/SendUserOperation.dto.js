var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsDefined, IsEthereumAddress, IsObject, IsString, ValidateNested, } from "class-validator";
import { Type } from "class-transformer";
import { IsBigNumber, IsCallData } from "../utils/index.js";
export class SendUserOperationStruct {
}
__decorate([
    IsEthereumAddress()
], SendUserOperationStruct.prototype, "sender", void 0);
__decorate([
    IsBigNumber()
], SendUserOperationStruct.prototype, "nonce", void 0);
__decorate([
    IsString(),
    IsCallData()
], SendUserOperationStruct.prototype, "initCode", void 0);
__decorate([
    IsString()
], SendUserOperationStruct.prototype, "callData", void 0);
__decorate([
    IsBigNumber()
], SendUserOperationStruct.prototype, "verificationGasLimit", void 0);
__decorate([
    IsBigNumber()
], SendUserOperationStruct.prototype, "preVerificationGas", void 0);
__decorate([
    IsBigNumber()
], SendUserOperationStruct.prototype, "maxFeePerGas", void 0);
__decorate([
    IsBigNumber()
], SendUserOperationStruct.prototype, "maxPriorityFeePerGas", void 0);
__decorate([
    IsString(),
    IsCallData()
], SendUserOperationStruct.prototype, "paymasterAndData", void 0);
__decorate([
    IsString()
], SendUserOperationStruct.prototype, "signature", void 0);
__decorate([
    IsBigNumber()
], SendUserOperationStruct.prototype, "callGasLimit", void 0);
export class SendUserOperationGasArgs {
}
__decorate([
    IsDefined(),
    IsObject(),
    ValidateNested(),
    Type(() => SendUserOperationStruct)
], SendUserOperationGasArgs.prototype, "userOp", void 0);
__decorate([
    IsEthereumAddress()
], SendUserOperationGasArgs.prototype, "entryPoint", void 0);
//# sourceMappingURL=SendUserOperation.dto.js.map