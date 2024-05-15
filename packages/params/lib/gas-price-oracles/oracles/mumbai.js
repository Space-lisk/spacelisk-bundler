import { parseGwei } from "./utils.js";
export const getMumbaiGasFee = async () => {
    const oracle = "https://gasstation-testnet.polygon.technology/v2";
    const data = await (await fetch(oracle)).json();
    return {
        maxPriorityFeePerGas: parseGwei(data.fast.maxPriorityFee),
        maxFeePerGas: parseGwei(data.fast.maxFee),
        gasPrice: parseGwei(data.fast.maxFee),
    };
};
//# sourceMappingURL=mumbai.js.map