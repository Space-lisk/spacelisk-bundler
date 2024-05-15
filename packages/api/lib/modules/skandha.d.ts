import { Eth } from "executor/lib/modules/eth";
import { GetConfigResponse, GetFeeHistoryResponse, GetGasPriceResponse, UserOperationStatus } from "types/lib/api/interfaces";
import { Skandha } from "executor/lib/modules";
import { FeeHistoryArgs } from "../dto/FeeHistory.dto";
export declare class SkandhaAPI {
    private ethModule;
    private skandhaModule;
    constructor(ethModule: Eth, skandhaModule: Skandha);
    /**
     * @param entryPoint Entry Point
     * @param useropCount Number of blocks in the requested range
     * @param newestBlock Highest number block of the requested range, or "latest"
     * @returns
     */
    getFeeHistory(args: FeeHistoryArgs): Promise<GetFeeHistoryResponse>;
    /**
     * @params hash hash of a userop
     * @returns status
     */
    getUserOperationStatus(hash: string): Promise<UserOperationStatus>;
    getGasPrice(): Promise<GetGasPriceResponse>;
    getConfig(): Promise<GetConfigResponse>;
    getPeers(): Promise<{
        cid: string;
        str: string;
        type: string;
    }[]>;
}
//# sourceMappingURL=skandha.d.ts.map