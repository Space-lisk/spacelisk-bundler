import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { NodeAPIModules } from "./types";
export default function api(modules: NodeAPIModules): (entryPoint: string, userOp: UserOperationStruct, blockHash: string, mempool: string) => Promise<void>;
//# sourceMappingURL=publishVerifiedUserOperationJSON.d.ts.map