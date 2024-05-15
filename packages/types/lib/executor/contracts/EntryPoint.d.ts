import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export type UserOperationStruct = {
    sender: string;
    nonce: BigNumberish;
    initCode: BytesLike;
    callData: BytesLike;
    callGasLimit: BigNumberish;
    verificationGasLimit: BigNumberish;
    preVerificationGas: BigNumberish;
    maxFeePerGas: BigNumberish;
    maxPriorityFeePerGas: BigNumberish;
    paymasterAndData: BytesLike;
    signature: BytesLike;
};
export type UserOperationStructOutput = [
    string,
    BigNumber,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    string
] & {
    sender: string;
    nonce: BigNumber;
    initCode: string;
    callData: string;
    callGasLimit: BigNumber;
    verificationGasLimit: BigNumber;
    preVerificationGas: BigNumber;
    maxFeePerGas: BigNumber;
    maxPriorityFeePerGas: BigNumber;
    paymasterAndData: string;
    signature: string;
};
export declare namespace IStakeManager {
    type DepositInfoStruct = {
        deposit: BigNumberish;
        staked: boolean;
        stake: BigNumberish;
        unstakeDelaySec: BigNumberish;
        withdrawTime: BigNumberish;
    };
    type DepositInfoStructOutput = [
        BigNumber,
        boolean,
        BigNumber,
        number,
        number
    ] & {
        deposit: BigNumber;
        staked: boolean;
        stake: BigNumber;
        unstakeDelaySec: number;
        withdrawTime: number;
    };
}
export declare namespace IEntryPoint {
    type UserOpsPerAggregatorStruct = {
        userOps: UserOperationStruct[];
        aggregator: string;
        signature: BytesLike;
    };
    type UserOpsPerAggregatorStructOutput = [
        UserOperationStructOutput[],
        string,
        string
    ] & {
        userOps: UserOperationStructOutput[];
        aggregator: string;
        signature: string;
    };
}
export interface IEntryPointInterface extends utils.Interface {
    functions: {
        "addStake(uint32)": FunctionFragment;
        "balanceOf(address)": FunctionFragment;
        "depositTo(address)": FunctionFragment;
        "getDepositInfo(address)": FunctionFragment;
        "getNonce(address,uint192)": FunctionFragment;
        "getSenderAddress(bytes)": FunctionFragment;
        "getUserOpHash((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes))": FunctionFragment;
        "handleAggregatedOps(((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],address,bytes)[],address)": FunctionFragment;
        "handleOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],address)": FunctionFragment;
        "incrementNonce(uint192)": FunctionFragment;
        "simulateHandleOp((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes),address,bytes)": FunctionFragment;
        "simulateValidation((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes))": FunctionFragment;
        "unlockStake()": FunctionFragment;
        "withdrawStake(address)": FunctionFragment;
        "withdrawTo(address,uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "addStake" | "balanceOf" | "depositTo" | "getDepositInfo" | "getNonce" | "getSenderAddress" | "getUserOpHash" | "handleAggregatedOps" | "handleOps" | "incrementNonce" | "simulateHandleOp" | "simulateValidation" | "unlockStake" | "withdrawStake" | "withdrawTo"): FunctionFragment;
    encodeFunctionData(functionFragment: "addStake", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
    encodeFunctionData(functionFragment: "depositTo", values: [string]): string;
    encodeFunctionData(functionFragment: "getDepositInfo", values: [string]): string;
    encodeFunctionData(functionFragment: "getNonce", values: [string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getSenderAddress", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getUserOpHash", values: [UserOperationStruct]): string;
    encodeFunctionData(functionFragment: "handleAggregatedOps", values: [IEntryPoint.UserOpsPerAggregatorStruct[], string]): string;
    encodeFunctionData(functionFragment: "handleOps", values: [UserOperationStruct[], string]): string;
    encodeFunctionData(functionFragment: "incrementNonce", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "simulateHandleOp", values: [
        UserOperationStruct,
        string,
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "simulateValidation", values: [UserOperationStruct]): string;
    encodeFunctionData(functionFragment: "unlockStake", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdrawStake", values: [string]): string;
    encodeFunctionData(functionFragment: "withdrawTo", values: [string, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "addStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getDepositInfo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSenderAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getUserOpHash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "handleAggregatedOps", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "handleOps", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "incrementNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "simulateHandleOp", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "simulateValidation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unlockStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawTo", data: BytesLike): Result;
    events: {
        "AccountDeployed(bytes32,address,address,address)": EventFragment;
        "BeforeExecution()": EventFragment;
        "Deposited(address,uint256)": EventFragment;
        "SignatureAggregatorChanged(address)": EventFragment;
        "StakeLocked(address,uint256,uint256)": EventFragment;
        "StakeUnlocked(address,uint256)": EventFragment;
        "StakeWithdrawn(address,address,uint256)": EventFragment;
        "UserOperationEvent(bytes32,address,address,uint256,bool,uint256,uint256)": EventFragment;
        "UserOperationRevertReason(bytes32,address,uint256,bytes)": EventFragment;
        "Withdrawn(address,address,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AccountDeployed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BeforeExecution"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Deposited"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SignatureAggregatorChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "StakeLocked"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "StakeUnlocked"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "StakeWithdrawn"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UserOperationEvent"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UserOperationRevertReason"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}
export interface AccountDeployedEventObject {
    userOpHash: string;
    sender: string;
    factory: string;
    paymaster: string;
}
export type AccountDeployedEvent = TypedEvent<[
    string,
    string,
    string,
    string
], AccountDeployedEventObject>;
export type AccountDeployedEventFilter = TypedEventFilter<AccountDeployedEvent>;
export interface BeforeExecutionEventObject {
}
export type BeforeExecutionEvent = TypedEvent<[], BeforeExecutionEventObject>;
export type BeforeExecutionEventFilter = TypedEventFilter<BeforeExecutionEvent>;
export interface DepositedEventObject {
    account: string;
    totalDeposit: BigNumber;
}
export type DepositedEvent = TypedEvent<[
    string,
    BigNumber
], DepositedEventObject>;
export type DepositedEventFilter = TypedEventFilter<DepositedEvent>;
export interface SignatureAggregatorChangedEventObject {
    aggregator: string;
}
export type SignatureAggregatorChangedEvent = TypedEvent<[
    string
], SignatureAggregatorChangedEventObject>;
export type SignatureAggregatorChangedEventFilter = TypedEventFilter<SignatureAggregatorChangedEvent>;
export interface StakeLockedEventObject {
    account: string;
    totalStaked: BigNumber;
    unstakeDelaySec: BigNumber;
}
export type StakeLockedEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], StakeLockedEventObject>;
export type StakeLockedEventFilter = TypedEventFilter<StakeLockedEvent>;
export interface StakeUnlockedEventObject {
    account: string;
    withdrawTime: BigNumber;
}
export type StakeUnlockedEvent = TypedEvent<[
    string,
    BigNumber
], StakeUnlockedEventObject>;
export type StakeUnlockedEventFilter = TypedEventFilter<StakeUnlockedEvent>;
export interface StakeWithdrawnEventObject {
    account: string;
    withdrawAddress: string;
    amount: BigNumber;
}
export type StakeWithdrawnEvent = TypedEvent<[
    string,
    string,
    BigNumber
], StakeWithdrawnEventObject>;
export type StakeWithdrawnEventFilter = TypedEventFilter<StakeWithdrawnEvent>;
export interface UserOperationEventEventObject {
    userOpHash: string;
    sender: string;
    paymaster: string;
    nonce: BigNumber;
    success: boolean;
    actualGasCost: BigNumber;
    actualGasUsed: BigNumber;
}
export type UserOperationEventEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber,
    boolean,
    BigNumber,
    BigNumber
], UserOperationEventEventObject>;
export type UserOperationEventEventFilter = TypedEventFilter<UserOperationEventEvent>;
export interface UserOperationRevertReasonEventObject {
    userOpHash: string;
    sender: string;
    nonce: BigNumber;
    revertReason: string;
}
export type UserOperationRevertReasonEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    string
], UserOperationRevertReasonEventObject>;
export type UserOperationRevertReasonEventFilter = TypedEventFilter<UserOperationRevertReasonEvent>;
export interface WithdrawnEventObject {
    account: string;
    withdrawAddress: string;
    amount: BigNumber;
}
export type WithdrawnEvent = TypedEvent<[
    string,
    string,
    BigNumber
], WithdrawnEventObject>;
export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;
export interface IEntryPoint extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IEntryPointInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        addStake(_unstakeDelaySec: BigNumberish, overrides?: PayableOverrides & {
            from?: string;
        }): Promise<ContractTransaction>;
        balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        depositTo(account: string, overrides?: PayableOverrides & {
            from?: string;
        }): Promise<ContractTransaction>;
        getDepositInfo(account: string, overrides?: CallOverrides): Promise<[
            IStakeManager.DepositInfoStructOutput
        ] & {
            info: IStakeManager.DepositInfoStructOutput;
        }>;
        getNonce(sender: string, key: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber] & {
            nonce: BigNumber;
        }>;
        getSenderAddress(initCode: BytesLike, overrides?: Overrides & {
            from?: string;
        }): Promise<ContractTransaction>;
        getUserOpHash(userOp: UserOperationStruct, overrides?: CallOverrides): Promise<[string]>;
        handleAggregatedOps(opsPerAggregator: IEntryPoint.UserOpsPerAggregatorStruct[], beneficiary: string, overrides?: Overrides & {
            from?: string;
        }): Promise<ContractTransaction>;
        handleOps(ops: UserOperationStruct[], beneficiary: string, overrides?: Overrides & {
            from?: string;
        }): Promise<ContractTransaction>;
        incrementNonce(key: BigNumberish, overrides?: Overrides & {
            from?: string;
        }): Promise<ContractTransaction>;
        simulateHandleOp(op: UserOperationStruct, target: string, targetCallData: BytesLike, overrides?: Overrides & {
            from?: string;
        }): Promise<ContractTransaction>;
        simulateValidation(userOp: UserOperationStruct, overrides?: Overrides & {
            from?: string;
        }): Promise<ContractTransaction>;
        unlockStake(overrides?: Overrides & {
            from?: string;
        }): Promise<ContractTransaction>;
        withdrawStake(withdrawAddress: string, overrides?: Overrides & {
            from?: string;
        }): Promise<ContractTransaction>;
        withdrawTo(withdrawAddress: string, withdrawAmount: BigNumberish, overrides?: Overrides & {
            from?: string;
        }): Promise<ContractTransaction>;
    };
    addStake(_unstakeDelaySec: BigNumberish, overrides?: PayableOverrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
    depositTo(account: string, overrides?: PayableOverrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    getDepositInfo(account: string, overrides?: CallOverrides): Promise<IStakeManager.DepositInfoStructOutput>;
    getNonce(sender: string, key: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    getSenderAddress(initCode: BytesLike, overrides?: Overrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    getUserOpHash(userOp: UserOperationStruct, overrides?: CallOverrides): Promise<string>;
    handleAggregatedOps(opsPerAggregator: IEntryPoint.UserOpsPerAggregatorStruct[], beneficiary: string, overrides?: Overrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    handleOps(ops: UserOperationStruct[], beneficiary: string, overrides?: Overrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    incrementNonce(key: BigNumberish, overrides?: Overrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    simulateHandleOp(op: UserOperationStruct, target: string, targetCallData: BytesLike, overrides?: Overrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    simulateValidation(userOp: UserOperationStruct, overrides?: Overrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    unlockStake(overrides?: Overrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    withdrawStake(withdrawAddress: string, overrides?: Overrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    withdrawTo(withdrawAddress: string, withdrawAmount: BigNumberish, overrides?: Overrides & {
        from?: string;
    }): Promise<ContractTransaction>;
    callStatic: {
        addStake(_unstakeDelaySec: BigNumberish, overrides?: CallOverrides): Promise<void>;
        balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
        depositTo(account: string, overrides?: CallOverrides): Promise<void>;
        getDepositInfo(account: string, overrides?: CallOverrides): Promise<IStakeManager.DepositInfoStructOutput>;
        getNonce(sender: string, key: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        getSenderAddress(initCode: BytesLike, overrides?: CallOverrides): Promise<void>;
        getUserOpHash(userOp: UserOperationStruct, overrides?: CallOverrides): Promise<string>;
        handleAggregatedOps(opsPerAggregator: IEntryPoint.UserOpsPerAggregatorStruct[], beneficiary: string, overrides?: CallOverrides): Promise<void>;
        handleOps(ops: UserOperationStruct[], beneficiary: string, overrides?: CallOverrides): Promise<void>;
        incrementNonce(key: BigNumberish, overrides?: CallOverrides): Promise<void>;
        simulateHandleOp(op: UserOperationStruct, target: string, targetCallData: BytesLike, overrides?: CallOverrides): Promise<void>;
        simulateValidation(userOp: UserOperationStruct, overrides?: CallOverrides): Promise<void>;
        unlockStake(overrides?: CallOverrides): Promise<void>;
        withdrawStake(withdrawAddress: string, overrides?: CallOverrides): Promise<void>;
        withdrawTo(withdrawAddress: string, withdrawAmount: BigNumberish, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AccountDeployed(bytes32,address,address,address)"(userOpHash?: BytesLike | null, sender?: string | null, factory?: null, paymaster?: null): AccountDeployedEventFilter;
        AccountDeployed(userOpHash?: BytesLike | null, sender?: string | null, factory?: null, paymaster?: null): AccountDeployedEventFilter;
        "BeforeExecution()"(): BeforeExecutionEventFilter;
        BeforeExecution(): BeforeExecutionEventFilter;
        "Deposited(address,uint256)"(account?: string | null, totalDeposit?: null): DepositedEventFilter;
        Deposited(account?: string | null, totalDeposit?: null): DepositedEventFilter;
        "SignatureAggregatorChanged(address)"(aggregator?: string | null): SignatureAggregatorChangedEventFilter;
        SignatureAggregatorChanged(aggregator?: string | null): SignatureAggregatorChangedEventFilter;
        "StakeLocked(address,uint256,uint256)"(account?: string | null, totalStaked?: null, unstakeDelaySec?: null): StakeLockedEventFilter;
        StakeLocked(account?: string | null, totalStaked?: null, unstakeDelaySec?: null): StakeLockedEventFilter;
        "StakeUnlocked(address,uint256)"(account?: string | null, withdrawTime?: null): StakeUnlockedEventFilter;
        StakeUnlocked(account?: string | null, withdrawTime?: null): StakeUnlockedEventFilter;
        "StakeWithdrawn(address,address,uint256)"(account?: string | null, withdrawAddress?: null, amount?: null): StakeWithdrawnEventFilter;
        StakeWithdrawn(account?: string | null, withdrawAddress?: null, amount?: null): StakeWithdrawnEventFilter;
        "UserOperationEvent(bytes32,address,address,uint256,bool,uint256,uint256)"(userOpHash?: BytesLike | null, sender?: string | null, paymaster?: string | null, nonce?: null, success?: null, actualGasCost?: null, actualGasUsed?: null): UserOperationEventEventFilter;
        UserOperationEvent(userOpHash?: BytesLike | null, sender?: string | null, paymaster?: string | null, nonce?: null, success?: null, actualGasCost?: null, actualGasUsed?: null): UserOperationEventEventFilter;
        "UserOperationRevertReason(bytes32,address,uint256,bytes)"(userOpHash?: BytesLike | null, sender?: string | null, nonce?: null, revertReason?: null): UserOperationRevertReasonEventFilter;
        UserOperationRevertReason(userOpHash?: BytesLike | null, sender?: string | null, nonce?: null, revertReason?: null): UserOperationRevertReasonEventFilter;
        "Withdrawn(address,address,uint256)"(account?: string | null, withdrawAddress?: null, amount?: null): WithdrawnEventFilter;
        Withdrawn(account?: string | null, withdrawAddress?: null, amount?: null): WithdrawnEventFilter;
    };
    estimateGas: {
        addStake(_unstakeDelaySec: BigNumberish, overrides?: PayableOverrides & {
            from?: string;
        }): Promise<BigNumber>;
        balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;
        depositTo(account: string, overrides?: PayableOverrides & {
            from?: string;
        }): Promise<BigNumber>;
        getDepositInfo(account: string, overrides?: CallOverrides): Promise<BigNumber>;
        getNonce(sender: string, key: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        getSenderAddress(initCode: BytesLike, overrides?: Overrides & {
            from?: string;
        }): Promise<BigNumber>;
        getUserOpHash(userOp: UserOperationStruct, overrides?: CallOverrides): Promise<BigNumber>;
        handleAggregatedOps(opsPerAggregator: IEntryPoint.UserOpsPerAggregatorStruct[], beneficiary: string, overrides?: Overrides & {
            from?: string;
        }): Promise<BigNumber>;
        handleOps(ops: UserOperationStruct[], beneficiary: string, overrides?: Overrides & {
            from?: string;
        }): Promise<BigNumber>;
        incrementNonce(key: BigNumberish, overrides?: Overrides & {
            from?: string;
        }): Promise<BigNumber>;
        simulateHandleOp(op: UserOperationStruct, target: string, targetCallData: BytesLike, overrides?: Overrides & {
            from?: string;
        }): Promise<BigNumber>;
        simulateValidation(userOp: UserOperationStruct, overrides?: Overrides & {
            from?: string;
        }): Promise<BigNumber>;
        unlockStake(overrides?: Overrides & {
            from?: string;
        }): Promise<BigNumber>;
        withdrawStake(withdrawAddress: string, overrides?: Overrides & {
            from?: string;
        }): Promise<BigNumber>;
        withdrawTo(withdrawAddress: string, withdrawAmount: BigNumberish, overrides?: Overrides & {
            from?: string;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        addStake(_unstakeDelaySec: BigNumberish, overrides?: PayableOverrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
        balanceOf(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        depositTo(account: string, overrides?: PayableOverrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
        getDepositInfo(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getNonce(sender: string, key: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSenderAddress(initCode: BytesLike, overrides?: Overrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
        getUserOpHash(userOp: UserOperationStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        handleAggregatedOps(opsPerAggregator: IEntryPoint.UserOpsPerAggregatorStruct[], beneficiary: string, overrides?: Overrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
        handleOps(ops: UserOperationStruct[], beneficiary: string, overrides?: Overrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
        incrementNonce(key: BigNumberish, overrides?: Overrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
        simulateHandleOp(op: UserOperationStruct, target: string, targetCallData: BytesLike, overrides?: Overrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
        simulateValidation(userOp: UserOperationStruct, overrides?: Overrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
        unlockStake(overrides?: Overrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
        withdrawStake(withdrawAddress: string, overrides?: Overrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
        withdrawTo(withdrawAddress: string, withdrawAmount: BigNumberish, overrides?: Overrides & {
            from?: string;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=EntryPoint.d.ts.map