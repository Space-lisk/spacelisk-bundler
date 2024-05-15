var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsEthereumAddress } from "class-validator";
import { RpcMethodValidator } from "../utils/RpcMethodValidator.js";
import { SetReputationArgs, } from "../dto/SetReputation.dto.js";
import { SetBundlingIntervalArgs } from "../dto/SetBundlingInterval.dto.js";
import { SetMempoolArgs } from "../dto/SetMempool.dto.js";
export class DumpReputationArgs {
}
__decorate([
    IsEthereumAddress()
], DumpReputationArgs.prototype, "entryPoint", void 0);
/*
  SPEC: https://eips.ethereum.org/EIPS/eip-4337#rpc-methods-debug-namespace
*/
export class DebugAPI {
    constructor(debugModule) {
        this.debugModule = debugModule;
    }
    /**
     * Sets bundling mode.
     * After setting mode to “manual”, an explicit call to debug_bundler_sendBundleNow is required to send a bundle.
     */
    async setBundlingMode(mode) {
        return this.debugModule.setBundlingMode(mode);
    }
    /**
     * Clears the bundler mempool and reputation data of paymasters/accounts/factories/aggregators
     */
    async clearState() {
        return await this.debugModule.clearState();
    }
    /*
     * Clears the bundler mempool
     */
    async clearMempool() {
        return await this.debugModule.clearMempool();
    }
    /**
     * Dumps the current UserOperations mempool
     * array - Array of UserOperations currently in the mempool
     */
    async dumpMempool() {
        return await this.debugModule.dumpMempool();
    }
    async dumpMempoolRaw() {
        return await this.debugModule.dumpMempoolRaw();
    }
    /**
     * Forces the bundler to build and execute a bundle from the mempool as handleOps() transaction
     */
    async sendBundleNow() {
        return await this.debugModule.sendBundleNow();
    }
    /**
     * Sets reputation of given addresses. parameters:
     * An array of reputation entries to add/replace, with the fields:
     * reputations - An array of reputation entries to add/replace, with the fields:
     *        address - The address to set the reputation for.
     *        opsSeen - number of times a user operations with that entity was seen and added to the mempool
     *        opsIncluded - number of times a user operations that uses this entity was included on-chain
     *        status? - (string) The status of the address in the bundler ‘ok’
     * entryPoint the entrypoint used by eth_sendUserOperation
     */
    async setReputation(args) {
        return await this.debugModule.setReputation(args);
    }
    /**
     * Returns the reputation data of all observed addresses.
     * Returns an array of reputation objects, each with the fields described above in debug_bundler_setReputation with the
     * entryPoint - The entrypoint used by eth_sendUserOperation
     */
    async dumpReputation(args) {
        return await this.debugModule.dumpReputation(args.entryPoint);
    }
    /**
     * Sets bundling interval. parameters:
     * interval - interval in seconds
     * returns "ok"
     */
    async setBundlingInterval(args) {
        return await this.debugModule.setBundlingInterval(args.interval);
    }
    /**
     * Seeds the local mempool with the passed array. Parameters:
     * userOps - An array of UserOperations.
     * returns "ok"
     */
    async setMempool(args) {
        return await this.debugModule.setMempool(args);
    }
    async getStakeStatus(args) {
        return await this.debugModule.getStakeStatus(args.address, args.entryPoint);
    }
}
__decorate([
    RpcMethodValidator(SetReputationArgs)
], DebugAPI.prototype, "setReputation", null);
__decorate([
    RpcMethodValidator(DumpReputationArgs)
], DebugAPI.prototype, "dumpReputation", null);
__decorate([
    RpcMethodValidator(SetBundlingIntervalArgs)
], DebugAPI.prototype, "setBundlingInterval", null);
__decorate([
    RpcMethodValidator(SetMempoolArgs)
], DebugAPI.prototype, "setMempool", null);
//# sourceMappingURL=debug.js.map