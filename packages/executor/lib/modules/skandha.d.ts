import { BigNumberish, ethers } from "ethers";
import { Logger } from "types/lib";
import { GetConfigResponse, GetFeeHistoryResponse, GetGasPriceResponse, UserOperationStatus } from "types/lib/api/interfaces";
import { GetNodeAPI, NetworkConfig } from "../interfaces";
import { Config } from "../config";
import { MempoolService } from "../services";
export declare class Skandha {
    private getNodeAPI;
    private mempoolService;
    private chainId;
    private provider;
    private config;
    private logger;
    networkConfig: NetworkConfig;
    constructor(getNodeAPI: GetNodeAPI, mempoolService: MempoolService, chainId: number, provider: ethers.providers.JsonRpcProvider, config: Config, logger: Logger);
    getUserOperationStatus(hash: string): Promise<UserOperationStatus>;
    getGasPrice(): Promise<GetGasPriceResponse>;
    getConfig(): Promise<GetConfigResponse>;
    /**
     * see eth_feeHistory
     * @param entryPoint Entry Point contract
     * @param blockCount Number of blocks in the requested range
     * @param newestBlock Highest number block of the requested range, or "latest"
     */
    getFeeHistory(entryPoint: string, blockCount: BigNumberish, newestBlock: BigNumberish | string): Promise<GetFeeHistoryResponse>;
    getPeers(): Promise<{
        cid: string;
        str: string;
        type: string;
    }[]>;
}
//# sourceMappingURL=skandha.d.ts.map