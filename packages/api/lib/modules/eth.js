var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RpcMethodValidator } from "../utils/RpcMethodValidator.js";
import { SendUserOperationGasArgs } from "../dto/SendUserOperation.dto.js";
import { EstimateUserOperationGasArgs } from "../dto/EstimateUserOperation.dto.js";
export class EthAPI {
    constructor(ethModule) {
        this.ethModule = ethModule;
    }
    /**
     *
     * @param userOp a full user-operation struct. All fields MUST be set as hex values. empty bytes block (e.g. empty initCode) MUST be set to "0x"
     * @param entryPoint the entrypoint address the request should be sent through. this MUST be one of the entry points returned by the supportedEntryPoints rpc call.
     */
    async sendUserOperation(args) {
        return await this.ethModule.sendUserOperation(args);
    }
    /**
     * @params args sama as in sendUserOperation
     */
    async estimateUserOpGasAndValidateSignature(args) {
        return await this.ethModule.estimateUserOperationGasWithSignature(args);
    }
    /**
     * Estimate the gas values for a UserOperation. Given UserOperation optionally without gas limits and gas prices, return the needed gas limits.
     * The signature field is ignored by the wallet, so that the operation will not require user’s approval.
     * Still, it might require putting a “semi-valid” signature (e.g. a signature in the right length)
     * @param userOp same as eth_sendUserOperation gas limits (and prices) parameters are optional, but are used if specified
     * maxFeePerGas and maxPriorityFeePerGas default to zero
     * @param entryPoint Entry Point
     * @returns
     */
    async estimateUserOperationGas(args) {
        return await this.ethModule.estimateUserOperationGas(args);
    }
    /**
     *
     * @param hash user op hash
     * @returns null in case the UserOperation is not yet included in a block, or a full UserOperation,
     * with the addition of entryPoint, blockNumber, blockHash and transactionHash
     */
    async getUserOperationByHash(hash) {
        return await this.ethModule.getUserOperationByHash(hash);
    }
    /**
     *
     * @param hash user op hash
     * @returns a UserOperation receipt
     */
    async getUserOperationReceipt(hash) {
        return await this.ethModule.getUserOperationReceipt(hash);
    }
    /**
     * eth_chainId
     * @returns EIP-155 Chain ID.
     */
    async getChainId() {
        return await this.ethModule.getChainId();
    }
    /**
     * Returns an array of the entryPoint addresses supported by the client
     * The first element of the array SHOULD be the entryPoint addresses preferred by the client.
     * @returns Entry points
     */
    async getSupportedEntryPoints() {
        return await this.ethModule.getSupportedEntryPoints();
    }
}
__decorate([
    RpcMethodValidator(SendUserOperationGasArgs)
], EthAPI.prototype, "sendUserOperation", null);
__decorate([
    RpcMethodValidator(EstimateUserOperationGasArgs)
], EthAPI.prototype, "estimateUserOperationGas", null);
//# sourceMappingURL=eth.js.map