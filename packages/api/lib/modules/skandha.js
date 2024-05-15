var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import RpcError from "types/lib/api/errors/rpc-error.js";
import * as RpcErrorCodes from "types/lib/api/errors/rpc-error-codes.js";
import { RpcMethodValidator } from "../utils/RpcMethodValidator.js";
import { FeeHistoryArgs } from "../dto/FeeHistory.dto.js";
export class SkandhaAPI {
    constructor(ethModule, skandhaModule) {
        this.ethModule = ethModule;
        this.skandhaModule = skandhaModule;
    }
    /**
     * @param entryPoint Entry Point
     * @param useropCount Number of blocks in the requested range
     * @param newestBlock Highest number block of the requested range, or "latest"
     * @returns
     */
    async getFeeHistory(args) {
        if (!this.ethModule.validateEntryPoint(args.entryPoint)) {
            throw new RpcError("Invalid Entrypoint", RpcErrorCodes.INVALID_REQUEST);
        }
        return await this.skandhaModule.getFeeHistory(args.entryPoint, args.blockCount, args.newestBlock);
    }
    /**
     * @params hash hash of a userop
     * @returns status
     */
    async getUserOperationStatus(hash) {
        return this.skandhaModule.getUserOperationStatus(hash);
    }
    async getGasPrice() {
        return await this.skandhaModule.getGasPrice();
    }
    async getConfig() {
        return await this.skandhaModule.getConfig();
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async getPeers() {
        return await this.skandhaModule.getPeers();
    }
}
__decorate([
    RpcMethodValidator(FeeHistoryArgs)
], SkandhaAPI.prototype, "getFeeHistory", null);
//# sourceMappingURL=skandha.js.map