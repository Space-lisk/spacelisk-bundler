import { ts } from "types/lib";
import { BigNumberish } from "ethers";
import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
export declare const userOpHashToBytes: (hash: string) => ts.Bytes32;
export declare const userOpHashToString: (hash: ts.Bytes32) => string;
export declare const deserializeUserOp: (userOp: ts.UserOp) => {
    sender: string;
    nonce: BigNumberish;
    initCode: string;
    callData: string;
    callGasLimit: BigNumberish;
    verificationGasLimit: BigNumberish;
    preVerificationGas: BigNumberish;
    maxFeePerGas: BigNumberish;
    maxPriorityFeePerGas: BigNumberish;
    paymasterAndData: string;
    signature: string;
};
export declare const deserializeVerifiedUserOperation: (verifiedUserOp: ts.VerifiedUserOperation) => {
    entryPoint: string;
    userOp: {
        sender: string;
        nonce: BigNumberish;
        initCode: string;
        callData: string;
        callGasLimit: BigNumberish;
        verificationGasLimit: BigNumberish;
        preVerificationGas: BigNumberish;
        maxFeePerGas: BigNumberish;
        maxPriorityFeePerGas: BigNumberish;
        paymasterAndData: string;
        signature: string;
    };
};
export declare const serializeUserOp: (userOp: UserOperationStruct) => ts.UserOp;
export declare const toVerifiedUserOperation: (entryPoint: string, userOp: UserOperationStruct, blockHash: string) => ts.VerifiedUserOperation;
//# sourceMappingURL=userOp.d.ts.map