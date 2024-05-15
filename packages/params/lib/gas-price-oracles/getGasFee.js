import { oracles } from "./oracles/index.js";
export const getGasFee = async (chainId, provider, apiKey = "", options) => {
    var _a, _b, _c, _d, _e;
    if (oracles[chainId] !== undefined) {
        try {
            return await oracles[chainId](apiKey, provider, options);
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Couldn't fetch fee data for ${chainId}: ${err}`);
        }
    }
    try {
        const feeData = await provider.getFeeData();
        return {
            maxPriorityFeePerGas: (_b = (_a = feeData.maxPriorityFeePerGas) !== null && _a !== void 0 ? _a : feeData.gasPrice) !== null && _b !== void 0 ? _b : 0,
            maxFeePerGas: (_d = (_c = feeData.maxFeePerGas) !== null && _c !== void 0 ? _c : feeData.gasPrice) !== null && _d !== void 0 ? _d : 0,
            gasPrice: (_e = feeData.gasPrice) !== null && _e !== void 0 ? _e : 0,
        };
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Couldn't fetch fee data: ${err}`);
    }
    return {
        maxPriorityFeePerGas: undefined,
        maxFeePerGas: undefined,
        gasPrice: undefined,
    };
};
//# sourceMappingURL=getGasFee.js.map