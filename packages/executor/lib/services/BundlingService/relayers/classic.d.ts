import { Bundle } from "../../../interfaces";
import { BaseRelayer } from "./base";
export declare class ClassicRelayer extends BaseRelayer {
    sendBundle(bundle: Bundle): Promise<void>;
    /**
     * signs & sends a transaction
     * @param relayer wallet
     * @param transaction transaction request
     * @param storageMap storage map
     * @returns transaction hash
     */
    private submitTransaction;
}
//# sourceMappingURL=classic.d.ts.map