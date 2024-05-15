import { BigNumberish } from "ethers";
import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { MempoolEntryStatus } from "types/lib/executor";
import { IMempoolEntry, MempoolEntrySerialized } from "./interfaces";
export declare class MempoolEntry implements IMempoolEntry {
    chainId: number;
    userOp: UserOperationStruct;
    entryPoint: string;
    prefund: BigNumberish;
    aggregator?: string;
    factory?: string;
    paymaster?: string;
    lastUpdatedTime: number;
    userOpHash: string;
    status: MempoolEntryStatus;
    hash?: string;
    transaction?: string;
    actualTransaction?: string;
    submitAttempts: number;
    submittedTime?: number;
    revertReason?: string;
    constructor({ chainId, userOp, entryPoint, prefund, aggregator, factory, paymaster, userOpHash, hash, lastUpdatedTime, status, transaction, actualTransaction, submitAttempts, submittedTime, revertReason, }: {
        chainId: number;
        userOp: UserOperationStruct;
        entryPoint: string;
        prefund: BigNumberish;
        aggregator?: string | undefined;
        factory?: string | undefined;
        paymaster?: string | undefined;
        userOpHash: string;
        hash?: string | undefined;
        lastUpdatedTime?: number | undefined;
        status?: MempoolEntryStatus | undefined;
        transaction?: string | undefined;
        actualTransaction?: string | undefined;
        revertReason?: string | undefined;
        submitAttempts?: number | undefined;
        submittedTime?: number | undefined;
    });
    /**
     * Set status of an entry
     * If status is Pending, transaction hash is required
     */
    setStatus(status: MempoolEntryStatus, params?: {
        transaction?: string;
        revertReason?: string;
    }): void;
    /**
     * To replace an entry, a new entry must have at least 10% higher maxPriorityFeePerGas
     * and 10% higher maxPriorityFeePerGas than the existingEntry
     * Returns true if Entry can replace existingEntry
     * @param entry MempoolEntry
     * @returns boolaen
     */
    canReplace(existingEntry: MempoolEntry): boolean;
    /**
     * To replace an entry, a new entry must have at least 10% higher maxPriorityFeePerGas
     * and 10% higher maxPriorityFeePerGas than the existingEntry
     * Returns true if Entry can replace existingEntry
     * @param entry MempoolEntry
     * @returns boolaen
     */
    canReplaceWithTTL(existingEntry: MempoolEntry, ttl: number): boolean;
    isEqual(entry: MempoolEntry): boolean;
    static compareByCost(a: MempoolEntry, b: MempoolEntry): number;
    validateAndTransformUserOp(): void;
    serialize(): MempoolEntrySerialized;
}
//# sourceMappingURL=MempoolEntry.d.ts.map