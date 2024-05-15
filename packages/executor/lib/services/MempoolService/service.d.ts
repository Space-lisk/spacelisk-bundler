import { IDbController, Logger } from "types/lib";
import { MempoolEntryStatus } from "types/lib/executor";
import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { BigNumberish } from "ethers";
import { ReputationService } from "../ReputationService";
import { ExecutorEventBus } from "../SubscriptionService";
import { NetworkConfig, StakeInfo } from "../../interfaces";
import { MempoolEntrySerialized } from "../../entities/interfaces";
import { MempoolEntry } from "../../entities/MempoolEntry";
export declare class MempoolService {
    private db;
    private chainId;
    private reputationService;
    private eventBus;
    private networkConfig;
    private logger;
    private USEROP_COLLECTION_KEY;
    private USEROP_HASHES_COLLECTION_PREFIX;
    private mutex;
    private reputationCheck;
    constructor(db: IDbController, chainId: number, reputationService: ReputationService, eventBus: ExecutorEventBus, networkConfig: NetworkConfig, logger: Logger);
    /**
     * View functions
     */
    dump(): Promise<MempoolEntrySerialized[]>;
    fetchPendingUserOps(): Promise<MempoolEntry[]>;
    fetchManyByKeys(keys: string[]): Promise<MempoolEntry[]>;
    find(entry: MempoolEntry): Promise<MempoolEntry | null>;
    getEntryByHash(hash: string): Promise<MempoolEntry | null>;
    getNewEntriesSorted(size: number, offset?: number): Promise<MempoolEntry[]>;
    validateUserOpReplaceability(userOp: UserOperationStruct, entryPoint: string): Promise<boolean>;
    /**
     * Write functions
     */
    updateStatus(entries: MempoolEntry[], status: MempoolEntryStatus, params?: {
        transaction?: string;
        revertReason?: string;
    }): Promise<void>;
    clearState(): Promise<void>;
    attemptToBundle(entries: MempoolEntry[]): Promise<void>;
    addUserOp(userOp: UserOperationStruct, entryPoint: string, prefund: BigNumberish, senderInfo: StakeInfo, factoryInfo: StakeInfo | undefined, paymasterInfo: StakeInfo | undefined, aggregatorInfo: StakeInfo | undefined, userOpHash: string, hash?: string, aggregator?: string): Promise<void>;
    deleteOldUserOps(): Promise<void>;
    /**
     * Internal
     */
    private getKey;
    private fetchAll;
    private fetchKeys;
    private findByKey;
    private validateReplaceability;
    private update;
    private remove;
    private saveUserOpHash;
    private removeUserOpHash;
}
//# sourceMappingURL=service.d.ts.map