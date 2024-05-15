import { BigNumber } from "ethers";
import { IDbController } from "types/lib";
import { ReputationStatus } from "types/lib/executor";
import { ReputationEntry } from "../entities/ReputationEntry";
import { ReputationEntryDump } from "../entities/interfaces";
import { StakeInfo } from "../interfaces";
export declare class ReputationService {
    private db;
    private chainId;
    private minInclusionDenominator;
    private throttlingSlack;
    private banSlack;
    private readonly minStake;
    private readonly minUnstakeDelay;
    private REP_COLL_KEY;
    private WL_COLL_KEY;
    private BL_COLL_KEY;
    private mutex;
    constructor(db: IDbController, chainId: number, minInclusionDenominator: number, throttlingSlack: number, banSlack: number, minStake: BigNumber, minUnstakeDelay: number);
    /**
     * PUBLIC INTERFACE
     */
    fetchOne(address: string): Promise<ReputationEntry>;
    updateSeenStatus(address: string): Promise<void>;
    updateIncludedStatus(address: string): Promise<void>;
    getStatus(address: string): Promise<ReputationStatus>;
    setReputation(address: string, opsSeen: number, opsIncluded: number): Promise<void>;
    dump(): Promise<ReputationEntryDump[]>;
    crashedHandleOps(addr: string): Promise<void>;
    clearState(): Promise<void>;
    /**
     * Stake
     */
    /**
     *
     * @param info StakeInfo
     * @returns null on success otherwise error
     */
    checkStake(info: StakeInfo | undefined): Promise<{
        msg: string;
        code: number;
    }>;
    /**
     * @param entry - a non-sender unstaked entry.
     * @returns maxMempoolCount - the number of UserOperations this entity is allowed to have in the mempool.
     */
    calculateMaxAllowedMempoolOpsUnstaked(entry: ReputationEntry | null): number;
    /**
     * WHITELIST / BLACKLIST
     */
    isWhitelisted(addr: string): Promise<boolean>;
    isBlacklisted(addr: string): Promise<boolean>;
    fetchWhitelist(): Promise<string[]>;
    fetchBlacklist(): Promise<string[]>;
    addToWhitelist(address: string): Promise<void>;
    addToBlacklist(address: string): Promise<void>;
    removefromWhitelist(address: string): Promise<void>;
    removefromBlacklist(address: string): Promise<void>;
    /**
     * INTERNAL FUNCTIONS
     */
    private save;
    private getKey;
    private addToCollection;
}
//# sourceMappingURL=ReputationService.d.ts.map