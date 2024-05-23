import * as ssz from "../../../types/lib/primitive/sszTypes.js";
import { ethers } from "ethers";
export function bytes32ToNumber(bytes) {
    return ethers.BigNumber.from(ssz.Bytes32.toJson(bytes)).toNumber();
}
export function numberToBytes32(number) {
    return ssz.Bytes32.fromJson((number).toString(16).padStart(64, '0'));
}
//# sourceMappingURL=cursor.js.map