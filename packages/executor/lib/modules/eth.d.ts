import { ethers } from "ethers";
import { EstimatedUserOperationGas, UserOperationByHashResponse, UserOperationReceipt } from "types/lib/api/interfaces";
import { Logger } from "types/lib";
import { PerChainMetrics } from "monitoring/lib";
import { UserOpValidationService, MempoolService } from "../services";
import { GetNodeAPI, NetworkConfig } from "../interfaces";
import { EstimateUserOperationGasArgs, SendUserOperationGasArgs } from "./interfaces";
import { Skandha } from "./skandha";
export declare class Eth {
    private chainId;
    private provider;
    private userOpValidationService;
    private mempoolService;
    private skandhaModule;
    private config;
    private logger;
    private metrics;
    private getNodeAPI;
    private pvgEstimator;
    constructor(chainId: number, provider: ethers.providers.JsonRpcProvider, userOpValidationService: UserOpValidationService, mempoolService: MempoolService, skandhaModule: Skandha, config: NetworkConfig, logger: Logger, metrics: PerChainMetrics | null, getNodeAPI?: GetNodeAPI);
    /**
     *
     * @param userOp a full user-operation struct. All fields MUST be set as hex values. empty bytes block (e.g. empty initCode) MUST be set to "0x"
     * @param entryPoint the entrypoint address the request should be sent through. this MUST be one of the entry points returned by the supportedEntryPoints rpc call.
     */
    sendUserOperation(args: SendUserOperationGasArgs): Promise<string>;
    /**
     * Estimate the gas values for a UserOperation. Given UserOperation optionally without gas limits and gas prices, return the needed gas limits.
     * The signature field is ignored by the wallet, so that the operation will not require user’s approval.
     * Still, it might require putting a “semi-valid” signature (e.g. a signature in the right length)
     * @param userOp same as eth_sendUserOperation gas limits (and prices) parameters are optional, but are used if specified
     * maxFeePerGas and maxPriorityFeePerGas default to zero
     * @param entryPoint Entry Point
     * @returns
     */
    estimateUserOperationGas(args: EstimateUserOperationGasArgs): Promise<EstimatedUserOperationGas>;
    /**
     * Estimates userop gas and validates the signature
     * @param args same as in sendUserOperation
     */
    estimateUserOperationGasWithSignature(args: SendUserOperationGasArgs): Promise<EstimatedUserOperationGas>;
    /**
     * Validates UserOp. If the UserOp (sender + entryPoint + nonce) match the existing UserOp in mempool,
     * validates if new UserOp can replace the old one (gas fees must be higher by at least 10%)
     * @param userOp same as eth_sendUserOperation
     * @param entryPoint Entry Point
     * @returns
     */
    validateUserOp(args: SendUserOperationGasArgs): Promise<boolean>;
    /**
     *
     * @param hash user op hash
     * @returns null in case the UserOperation is not yet included in a block, or a full UserOperation,
     * with the addition of entryPoint, blockNumber, blockHash and transactionHash
     */
    getUserOperationByHash(hash: string): Promise<UserOperationByHashResponse | null>;
    /**
     *
     * @param hash user op hash
     * @returns a UserOperation receipt
     */
    getUserOperationReceipt(hash: string): Promise<UserOperationReceipt | null>;
    /**
     * eth_chainId
     * @returns EIP-155 Chain ID.
     */
    getChainId(): Promise<number>;
    /**
     * Returns an array of the entryPoint addresses supported by the client
     * The first element of the array SHOULD be the entryPoint addresses preferred by the client.
     * @returns Entry points
     */
    getSupportedEntryPoints(): Promise<string[]>;
    validateEntryPoint(entryPoint: string): boolean;
    static DefaultGasOverheads: {
        fixed: number;
        perUserOp: number;
        perUserOpWord: number;
        zeroByte: number;
        nonZeroByte: number;
        bundleSize: number;
        sigSize: number;
    };
    /**
     * calculate the preVerificationGas of the given UserOperation
     * preVerificationGas (by definition) is the cost overhead that can't be calculated on-chain.
     * it is based on parameters that are defined by the Ethereum protocol for external transactions.
     * @param userOp filled userOp to calculate. The only possible missing fields can be the signature and preVerificationGas itself
     * @param overheads gas overheads to use, to override the default values
     */
    private calcPreVerificationGas;
    private getUserOperationEvent;
    private filterLogs;
}
//# sourceMappingURL=eth.d.ts.map