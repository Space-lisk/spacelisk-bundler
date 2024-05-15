import { fetchJson, hexValue } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import { parseGwei } from "./utils.js";
export const getAncient8GasFee = async () => {
    const { gas_prices } = await fetchJson({
        url: "https://scan.ancient8.gg/api/v2/stats",
        headers: {
            "updated-gas-oracle": "true",
        },
    });
    const maxPriorityFeePerGas = hexValue(BigNumber.from(gas_prices.fast.priority_fee_wei));
    const maxFeePerGas = parseGwei(gas_prices.fast.priority_fee);
    return {
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        gasPrice: maxFeePerGas,
        maxFeePerGas: maxFeePerGas,
    };
};
//# sourceMappingURL=ancient8.js.map