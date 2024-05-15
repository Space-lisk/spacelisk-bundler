import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { Debug } from "executor/lib/modules";
import { BundlingMode } from "types/lib/api/interfaces";
import { GetStakeStatus } from "executor/lib/interfaces";
import { MempoolEntrySerialized } from "executor/lib/entities/interfaces";
import { SetReputationArgs, SetReputationResponse } from "../dto/SetReputation.dto";
import { SetBundlingIntervalArgs } from "../dto/SetBundlingInterval.dto";
import { SetMempoolArgs } from "../dto/SetMempool.dto";
import { GetStakeStatusArgs } from "../dto/GetStakeStatus.dto";
export declare class DumpReputationArgs {
    entryPoint: string;
}
export declare class DebugAPI {
    private debugModule;
    constructor(debugModule: Debug);
    /**
     * Sets bundling mode.
     * After setting mode to “manual”, an explicit call to debug_bundler_sendBundleNow is required to send a bundle.
     */
    setBundlingMode(mode: BundlingMode): Promise<string>;
    /**
     * Clears the bundler mempool and reputation data of paymasters/accounts/factories/aggregators
     */
    clearState(): Promise<string>;
    clearMempool(): Promise<string>;
    /**
     * Dumps the current UserOperations mempool
     * array - Array of UserOperations currently in the mempool
     */
    dumpMempool(): Promise<UserOperationStruct[]>;
    dumpMempoolRaw(): Promise<MempoolEntrySerialized[]>;
    /**
     * Forces the bundler to build and execute a bundle from the mempool as handleOps() transaction
     */
    sendBundleNow(): Promise<string>;
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
    setReputation(args: SetReputationArgs): Promise<string>;
    /**
     * Returns the reputation data of all observed addresses.
     * Returns an array of reputation objects, each with the fields described above in debug_bundler_setReputation with the
     * entryPoint - The entrypoint used by eth_sendUserOperation
     */
    dumpReputation(args: DumpReputationArgs): Promise<SetReputationResponse>;
    /**
     * Sets bundling interval. parameters:
     * interval - interval in seconds
     * returns "ok"
     */
    setBundlingInterval(args: SetBundlingIntervalArgs): Promise<string>;
    /**
     * Seeds the local mempool with the passed array. Parameters:
     * userOps - An array of UserOperations.
     * returns "ok"
     */
    setMempool(args: SetMempoolArgs): Promise<string>;
    getStakeStatus(args: GetStakeStatusArgs): Promise<GetStakeStatus>;
}
//# sourceMappingURL=debug.d.ts.map