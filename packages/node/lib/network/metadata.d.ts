import { ts } from "types/lib";
export declare enum ENRKey {
    tcp = "tcp",
    chainId = "chain_id"
}
export interface IMetadataOpts {
    chainId: number;
    metadata?: ts.Metadata;
}
/**
 * Implementation of ERC 4337 p2p MetaData.
 * For the spec that this code is based on, see:
 * https://github.com/eth-infinitism/bundler-spec/blob/main/p2p-specs/p2p-interface.md#metadata
 */
export declare class MetadataController {
    private setEnrValue?;
    private metadata;
    private chainId;
    constructor(opts: IMetadataOpts);
    start(setEnrValue: (key: string, value: Uint8Array) => Promise<void>): void;
    get seq_number(): bigint;
    get supported_mempools(): Uint8Array[];
    get json(): ts.Metadata;
}
//# sourceMappingURL=metadata.d.ts.map