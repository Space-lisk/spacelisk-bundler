import { providers } from "ethers";
import { BundlerCollectorReturn } from "types/lib/executor";
import { TracerPrestateResponse } from "../../interfaces";
export declare class GethTracer {
    private provider;
    constructor(provider: providers.JsonRpcProvider);
    debug_traceCall(tx: providers.TransactionRequest): Promise<BundlerCollectorReturn>;
    debug_traceCallPrestate(tx: providers.TransactionRequest): Promise<TracerPrestateResponse>;
}
//# sourceMappingURL=GethTracer.d.ts.map