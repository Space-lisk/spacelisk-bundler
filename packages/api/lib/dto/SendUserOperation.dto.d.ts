import { BigNumberish, BytesLike } from "ethers";
export declare class SendUserOperationStruct {
    sender: string;
    nonce: BigNumberish;
    initCode: BytesLike;
    callData: BytesLike;
    verificationGasLimit: BigNumberish;
    preVerificationGas: BigNumberish;
    maxFeePerGas: BigNumberish;
    maxPriorityFeePerGas: BigNumberish;
    paymasterAndData: BytesLike;
    signature: BytesLike;
    callGasLimit: BigNumberish;
}
export declare class SendUserOperationGasArgs {
    userOp: SendUserOperationStruct;
    entryPoint: string;
}
//# sourceMappingURL=SendUserOperation.dto.d.ts.map