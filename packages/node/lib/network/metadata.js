import { ssz } from "../../../types/lib/index.js";
export var ENRKey;
(function (ENRKey) {
    ENRKey["tcp"] = "tcp";
    ENRKey["chainId"] = "chain_id";
})(ENRKey || (ENRKey = {}));
/**
 * Implementation of ERC 4337 p2p MetaData.
 * For the spec that this code is based on, see:
 * https://github.com/eth-infinitism/bundler-spec/blob/main/p2p-specs/p2p-interface.md#metadata
 */
export class MetadataController {
    constructor(opts) {
        var _a;
        this.chainId = opts.chainId;
        this.metadata = (_a = opts.metadata) !== null && _a !== void 0 ? _a : ssz.Metadata.defaultValue();
    }
    start(setEnrValue) {
        this.setEnrValue = setEnrValue;
        void this.setEnrValue(ENRKey.chainId, ssz.ChainId.serialize(BigInt(this.chainId)));
    }
    get seq_number() {
        return this.metadata.seq_number;
    }
    get supported_mempools() {
        return this.metadata.supported_mempools;
    }
    get json() {
        return this.metadata;
    }
}
//# sourceMappingURL=metadata.js.map