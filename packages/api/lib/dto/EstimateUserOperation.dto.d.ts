import { BigNumberish, BytesLike } from "ethers";
export declare class EstimateUserOperationStruct {
    sender: string;
    nonce: BigNumberish;
    initCode: BytesLike;
    callData: BytesLike;
    signature: BytesLike;
    verificationGasLimit?: BigNumberish;
    preVerificationGas?: BigNumberish;
    maxFeePerGas?: BigNumberish;
    maxPriorityFeePerGas?: BigNumberish;
    paymasterAndData?: BytesLike;
    callGasLimit?: BigNumberish;
}
export declare class EstimateUserOperationGasArgs {
    userOp: EstimateUserOperationStruct;
    entryPoint: string;
}
//# sourceMappingURL=EstimateUserOperation.dto.d.ts.map