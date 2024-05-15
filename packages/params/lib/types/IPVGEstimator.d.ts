import { BigNumber, BigNumberish, providers } from "ethers";
import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
export type IPVGEstimatorWrapper = (provider: providers.StaticJsonRpcProvider) => IPVGEstimator;
export type IPVGEstimator = (entryPointAddr: string, userOp: UserOperationStruct, initial: BigNumberish) => Promise<BigNumber>;
//# sourceMappingURL=IPVGEstimator.d.ts.map