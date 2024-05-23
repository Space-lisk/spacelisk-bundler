import { fromHex } from "../../../../../utils/lib/index.js";
import { EncodedPayloadType } from "../../../reqresp/types.js";
export async function* onStatus(relayersConfig) {
    const provider = relayersConfig.getNetworkProvider();
    const block = await provider.getBlock("latest");
    yield {
        type: EncodedPayloadType.ssz,
        data: {
            chain_id: BigInt(relayersConfig.chainId),
            block_hash: fromHex(block.hash),
            block_number: BigInt(block.number),
        },
    };
}
//# sourceMappingURL=status.js.map