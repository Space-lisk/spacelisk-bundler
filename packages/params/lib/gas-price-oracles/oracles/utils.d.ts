import { BigNumber } from "ethers";
import { IGetGasFeeResult } from "./interfaces";
export declare function getEtherscanGasFee(apiUrl: string, apiKey?: string | undefined): Promise<IGetGasFeeResult>;
export declare function parseGwei(num: number | string): BigNumber;
//# sourceMappingURL=utils.d.ts.map