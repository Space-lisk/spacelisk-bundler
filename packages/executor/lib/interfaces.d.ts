import { BigNumber, BigNumberish, BytesLike } from "ethers";
import { IWhitelistedEntities, RelayingMode } from "types/lib/executor";
import { INodeAPI } from "types/lib/node";
import { MempoolEntry } from "./entities/MempoolEntry";
export interface Log {
    blockNumber: number;
    blockHash: string;
    transactionIndex: number;
    removed: boolean;
    address: string;
    data: string;
    topics: Array<string>;
    transactionHash: string;
    logIndex: number;
}
export interface TracerResult {
    trace: TracerTracer;
    calls: TracerCall[];
}
export interface TracerTracer {
    [address: string]: {
        balance?: BigNumberish;
        contractSize?: number;
        number?: number;
        storage?: {
            [slot: string]: number | string;
        };
        keccak?: {
            [slot: string]: any;
        };
        violation?: {
            [opcode: string]: boolean;
        };
        value?: number;
    };
}
export interface TracerCall {
    type: string;
    from?: string;
    to?: string;
    method?: string;
    gas?: number;
    data?: string;
    return?: any;
    revert?: any;
    value?: BigNumberish;
}
export interface TracerPrestateResponse {
    [address: string]: {
        balance: BigNumberish;
        nonce: number;
        storage: {
            [slot: string]: number;
        };
        code: BytesLike;
    };
}
export type SupportedEntryPoints = string[];
export type EthChainIdResponse = {
    chainId: number;
};
export type BundlingMode = "auto" | "manual";
export type GetNodeAPI = () => INodeAPI | null;
export interface NetworkConfig {
    entryPoints: string[];
    relayers: string[];
    beneficiary: string;
    rpcEndpoint: string;
    minInclusionDenominator: number;
    throttlingSlack: number;
    banSlack: number;
    minSignerBalance: BigNumberish;
    minStake?: BigNumberish;
    minUnstakeDelay: number;
    multicall: string;
    cglMarkup: number;
    vglMarkup: number;
    validationGasLimit: number;
    receiptLookupRange: number;
    etherscanApiKey: string;
    conditionalTransactions: boolean;
    rpcEndpointSubmit: string;
    gasPriceMarkup: number;
    enforceGasPrice: boolean;
    enforceGasPriceThreshold: number;
    eip2930: boolean;
    useropsTTL: number;
    whitelistedEntities: IWhitelistedEntities;
    bundleGasLimitMarkup: number;
    relayingMode: RelayingMode;
    bundleInterval: number;
    bundleSize: number;
    pvgMarkup: number;
    canonicalMempoolId: string;
    canonicalEntryPoint: string;
    gasFeeInSimulation: boolean;
    merkleApiURL: string;
    skipBundleValidation: boolean;
    userOpGasLimit: number;
    bundleGasLimit: number;
    kolibriAuthKey: string;
    entryPointForwarder: string;
    echoAuthKey: string;
    archiveDuration: number;
    fastlaneValidators: string[];
}
export type BundlerConfig = Omit<NetworkConfig, "entryPoints" | "rpcEndpoint" | "relayer" | "relayers">;
export interface ConfigOptions {
    config: NetworkConfig | null;
    testingMode?: boolean;
    unsafeMode: boolean;
    redirectRpc: boolean;
}
export interface SlotMap {
    [slot: string]: string;
}
export interface StorageMap {
    [address: string]: string | SlotMap;
}
export interface ReferencedCodeHashes {
    addresses: string[];
    hash: string;
}
export interface UserOpValidationResult {
    returnInfo: {
        preOpGas: BigNumberish;
        prefund: BigNumberish;
        sigFailed: boolean;
        validAfter: number;
        validUntil: number;
    };
    senderInfo: StakeInfo;
    factoryInfo?: StakeInfo;
    paymasterInfo?: StakeInfo;
    aggregatorInfo?: StakeInfo;
    referencedContracts?: ReferencedCodeHashes;
    storageMap?: StorageMap;
}
export interface ExecutionResult {
    preOpGas: BigNumber;
    paid: number;
    validAfter: number;
    validUntil: number;
    targetSuccess: boolean;
    targetResult: string;
}
export interface StakeInfo {
    addr: string;
    stake: BigNumberish;
    unstakeDelaySec: BigNumberish;
}
export interface Bundle {
    entries: MempoolEntry[];
    maxFeePerGas: BigNumber;
    maxPriorityFeePerGas: BigNumber;
    storageMap: StorageMap;
}
export interface GetStakeStatus {
    stakeInfo: StakeInfo;
    isStaked: boolean;
}
export interface KnownEntities {
    accounts: string[];
    otherEntities: string[];
}
//# sourceMappingURL=interfaces.d.ts.map