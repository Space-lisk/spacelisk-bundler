import { BigNumber } from "ethers";
import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { MempoolEntry } from "../../../entities/MempoolEntry";
export declare function estimateBundleGasLimit(markup: number, bundle: MempoolEntry[]): BigNumber;
export declare function getUserOpGasLimit(userOp: UserOperationStruct, markup?: BigNumber): BigNumber;
//# sourceMappingURL=estimateBundleGasLimit.d.ts.map