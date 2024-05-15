import { parseGwei } from "./utils.js";
export const getMaticGasFee = async () => {
    const oracle = "https://gasstation.polygon.technology/v2";
    const data = await (await fetch(oracle)).json();
    return {
        maxPriorityFeePerGas: parseGwei(data.fast.maxPriorityFee),
        maxFeePerGas: parseGwei(data.fast.maxFee),
        gasPrice: parseGwei(data.fast.maxFee),
    };
};
//# sourceMappingURL=matic.js.map