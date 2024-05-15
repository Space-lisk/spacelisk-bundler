import { IEntryPoint } from "types/lib/executor/contracts";
import { providers } from "ethers";
import { MempoolEntry } from "../../../entities/MempoolEntry";
/**
 * returns userop hashes
 * @param entryPoint address of the entrypoint
 * @param userOps mempool entries
 * @param provider rpc provider
 * @param multicall address of the multicall3 contract
 */
export declare function getUserOpHashes(entryPoint: IEntryPoint, userOps: MempoolEntry[], provider: providers.JsonRpcProvider, multicall: string): Promise<string[]>;
//# sourceMappingURL=getUserOpHashes.d.ts.map