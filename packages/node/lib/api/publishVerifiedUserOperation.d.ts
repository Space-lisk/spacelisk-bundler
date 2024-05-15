import { ts } from "types/lib";
import { NodeAPIModules } from "./types";
export default function api(modules: NodeAPIModules): (userOp: ts.VerifiedUserOperation, mempool: string) => Promise<void>;
//# sourceMappingURL=publishVerifiedUserOperation.d.ts.map