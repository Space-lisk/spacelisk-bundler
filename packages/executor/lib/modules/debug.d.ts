import { providers } from "ethers";
import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { BundlingService, MempoolService, ReputationService } from "../services";
import { BundlingMode, GetStakeStatus, NetworkConfig } from "../interfaces";
import { MempoolEntrySerialized, ReputationEntryDump } from "../entities/interfaces";
import { SetReputationArgs, SetMempoolArgs } from "./interfaces";
export declare class Debug {
    private provider;
    private bundlingService;
    private mempoolService;
    private reputationService;
    private networkConfig;
    constructor(provider: providers.JsonRpcProvider, bundlingService: BundlingService, mempoolService: MempoolService, reputationService: ReputationService, networkConfig: NetworkConfig);
    /**
     * Sets bundling mode.
     * After setting mode to “manual”, an explicit call to debug_bundler_sendBundleNow is required to send a bundle.
     */
    setBundlingMode(mode: BundlingMode): Promise<string>;
    /**
     * Clears the bundler mempool and reputation data of paymasters/accounts/factories/aggregators
     */
    clearState(): Promise<string>;
    /**
     * Clears the bundler mempool
     */
    clearMempool(): Promise<string>;
    /**
     * Dumps the current UserOperations mempool
     * array - Array of UserOperations currently in the mempool
     */
    dumpMempool(): Promise<UserOperationStruct[]>;
    /**
     * Dumps the current UserOperations mempool
     * array - Array of UserOperations currently in the mempool
     */
    dumpMempoolRaw(): Promise<MempoolEntrySerialized[]>;
    /**
     * Forces the bundler to build and execute a bundle from the mempool as handleOps() transaction
     */
    sendBundleNow(): Promise<string>;
    setBundlingInterval(interval: number): Promise<string>;
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
    dumpReputation(entryPoint: string): Promise<ReputationEntryDump[]>;
    setMempool(mempool: SetMempoolArgs): Promise<string>;
    getStakeStatus(address: string, entryPoint: string): Promise<GetStakeStatus>;
}
//# sourceMappingURL=debug.d.ts.map