import { BytesLike } from "ethers";
import { IEntryPoint } from "types/lib/executor/contracts";
import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { BundlerCollectorReturn, CallEntry } from "types/lib/executor";
import { UserOpValidationResult, StakeInfo } from "../../interfaces";
export declare function nonGethErrorHandler(epContract: IEntryPoint, errorResult: any): any;
export declare function parseErrorResult(userOp: UserOperationStruct, errorResult: {
    errorName: string;
    errorArgs: any;
}): UserOpValidationResult;
export declare function compareBytecode(artifactBytecode: string, contractBytecode: string): number;
export declare function toBytes32(b: BytesLike | number): string;
export declare function requireCond(cond: boolean, msg: string, code?: number, data?: any): void;
/**
 * parse all call operation in the trace.
 * notes:
 * - entries are ordered by the return (so nested call appears before its outer call
 * - last entry is top-level return from "simulateValidation". it as ret and rettype, but no type or address
 * @param tracerResults
 */
export declare function parseCallStack(tracerResults: BundlerCollectorReturn): CallEntry[];
/**
 * slots associated with each entity.
 * keccak( A || ...) is associated with "A"
 * removed rule: keccak( ... || ASSOC ) (for a previously associated hash) is also associated with "A"
 *
 * @param stakeInfoEntities stake info for (factory, account, paymaster). factory and paymaster can be null.
 * @param keccak array of buffers that were given to keccak in the transaction
 */
export declare function parseEntitySlots(stakeInfoEntities: {
    [addr: string]: StakeInfo | undefined;
}, keccak: string[]): {
    [addr: string]: Set<string>;
};
export declare const callsFromEntryPointMethodSigs: {
    [key: string]: string;
};
export declare function isSlotAssociatedWith(slot: string, addr: string, entitySlots: {
    [addr: string]: Set<string>;
}): boolean;
export declare function parseValidationResult(entryPointContract: IEntryPoint, userOp: UserOperationStruct, data: string): UserOpValidationResult;
//# sourceMappingURL=utils.d.ts.map