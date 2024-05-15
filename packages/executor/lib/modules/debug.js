import { BigNumber } from "ethers";
import RpcError from "types/lib/api/errors/rpc-error.js";
import * as RpcErrorCodes from "types/lib/api/errors/rpc-error-codes.js";
import { IEntryPoint__factory, StakeManager__factory, } from "types/lib/executor/contracts/index.js";
import { MempoolEntryStatus } from "types/lib/executor/index.js";
import { getAddr } from "../utils/index.js";
/*
  SPEC: https://eips.ethereum.org/EIPS/eip-4337#rpc-methods-debug-namespace
*/
export class Debug {
    constructor(provider, bundlingService, mempoolService, reputationService, networkConfig) {
        this.provider = provider;
        this.bundlingService = bundlingService;
        this.mempoolService = mempoolService;
        this.reputationService = reputationService;
        this.networkConfig = networkConfig;
    }
    /**
     * Sets bundling mode.
     * After setting mode to “manual”, an explicit call to debug_bundler_sendBundleNow is required to send a bundle.
     */
    async setBundlingMode(mode) {
        if (mode !== "auto" && mode !== "manual") {
            throw new RpcError("Method is not supported", RpcErrorCodes.INVALID_REQUEST);
        }
        this.bundlingService.setBundlingMode(mode);
        return "ok";
    }
    /**
     * Clears the bundler mempool and reputation data of paymasters/accounts/factories/aggregators
     */
    async clearState() {
        await this.mempoolService.clearState();
        await this.reputationService.clearState();
        return "ok";
    }
    /**
     * Clears the bundler mempool
     */
    async clearMempool() {
        await this.mempoolService.clearState();
        return "ok";
    }
    /**
     * Dumps the current UserOperations mempool
     * array - Array of UserOperations currently in the mempool
     */
    async dumpMempool() {
        const entries = await this.mempoolService.dump();
        return entries
            .filter((entry) => entry.status === MempoolEntryStatus.New)
            .map((entry) => entry.userOp);
    }
    /**
     * Dumps the current UserOperations mempool
     * array - Array of UserOperations currently in the mempool
     */
    async dumpMempoolRaw() {
        const entries = await this.mempoolService.dump();
        return entries.map((entry) => entry);
    }
    /**
     * Forces the bundler to build and execute a bundle from the mempool as handleOps() transaction
     */
    async sendBundleNow() {
        await this.bundlingService.sendNextBundle();
        return "ok";
    }
    async setBundlingInterval(interval) {
        this.bundlingService.setBundlingInverval(interval);
        return "ok";
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
        for (const reputation of args.reputations) {
            await this.reputationService.setReputation(reputation.address, reputation.opsSeen, reputation.opsIncluded);
        }
        return "ok";
    }
    /**
     * Returns the reputation data of all observed addresses.
     * Returns an array of reputation objects, each with the fields described above in debug_bundler_setReputation with the
     * entryPoint - The entrypoint used by eth_sendUserOperation
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async dumpReputation(entryPoint) {
        return await this.reputationService.dump();
    }
    async setMempool(mempool) {
        const entryPointContract = IEntryPoint__factory.connect(mempool.entryPoint, this.provider);
        await this.mempoolService.clearState();
        // Loop through the array and persist to the local mempool without simulation.
        for (const userOp of mempool.userOps) {
            const userOpHash = await entryPointContract.getUserOpHash(userOp);
            await this.mempoolService.addUserOp(userOp, mempool.entryPoint, 0x0, {
                addr: userOp.sender,
                stake: 0,
                unstakeDelaySec: 0,
            }, getAddr(userOp.initCode)
                ? {
                    addr: getAddr(userOp.initCode),
                    stake: 0,
                    unstakeDelaySec: 0,
                }
                : undefined, getAddr(userOp.paymasterAndData)
                ? {
                    addr: getAddr(userOp.paymasterAndData),
                    stake: 0,
                    unstakeDelaySec: 0,
                }
                : undefined, undefined, userOpHash, undefined);
        }
        return "ok";
    }
    async getStakeStatus(address, entryPoint) {
        const sm = StakeManager__factory.connect(entryPoint, this.provider);
        const info = await sm.getDepositInfo(address);
        const isStaked = BigNumber.from(info.stake).gte(this.networkConfig.minStake) &&
            BigNumber.from(info.unstakeDelaySec).gte(this.networkConfig.minUnstakeDelay);
        return {
            stakeInfo: {
                addr: address,
                stake: info.stake.toString(),
                unstakeDelaySec: info.unstakeDelaySec.toString(),
            },
            isStaked,
        };
    }
}
//# sourceMappingURL=debug.js.map