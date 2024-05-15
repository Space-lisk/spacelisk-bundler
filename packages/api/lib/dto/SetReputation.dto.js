var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Type } from "class-transformer";
import { IsArray, IsDefined, IsEthereumAddress, IsNumber, ValidateNested, } from "class-validator";
export class SetReputationEntry {
}
__decorate([
    IsEthereumAddress()
], SetReputationEntry.prototype, "address", void 0);
__decorate([
    IsNumber()
], SetReputationEntry.prototype, "opsSeen", void 0);
__decorate([
    IsNumber()
], SetReputationEntry.prototype, "opsIncluded", void 0);
export class SetReputationArgs {
}
__decorate([
    IsDefined(),
    IsArray(),
    ValidateNested(),
    Type(() => SetReputationEntry)
], SetReputationArgs.prototype, "reputations", void 0);
__decorate([
    IsEthereumAddress()
], SetReputationArgs.prototype, "entryPoint", void 0);
//# sourceMappingURL=SetReputation.dto.js.map