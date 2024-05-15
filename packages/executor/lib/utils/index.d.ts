import { BytesLike } from "ethers/lib/utils";
import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
/**
 * pack the userOperation
 * @param op
 * @param forSignature "true" if the hash is needed to calculate the getUserOpHash()
 *  "false" to pack entire UserOp, for calculating the calldata cost of putting it on-chain.
 */
export declare function packUserOp(op: UserOperationStruct, forSignature?: boolean): string;
/**
 * calculate the userOpHash of a given userOperation.
 * The userOpHash is a hash of all UserOperation fields, except the "signature" field.
 * The entryPoint uses this value in the emitted UserOperationEvent.
 * A wallet may use this value as the hash to sign (the SampleWallet uses this method)
 * @param op
 * @param entryPoint
 * @param chainId
 */
export declare function getUserOpHash(op: UserOperationStruct, entryPoint: string, chainId: number): string;
export declare function extractAddrFromInitCode(data?: BytesLike): string | undefined;
/**
 * Unix timestamp * 1000
 * @returns time in milliseconds
 */
export declare function now(): number;
export declare function wait(milliseconds: number): Promise<void>;
export declare function getAddr(data?: BytesLike): string | undefined;
//# sourceMappingURL=index.d.ts.map