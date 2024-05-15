import { ethers } from "ethers";
export async function getEtherscanGasFee(apiUrl, apiKey = undefined) {
    let oracle = `${apiUrl}?module=proxy&action=eth_gasPrice`;
    if (apiKey) {
        oracle += `&apikey=${apiKey}`;
    }
    const data = await (await fetch(oracle)).json();
    const gasPrice = ethers.BigNumber.from(data.result);
    return {
        maxPriorityFeePerGas: gasPrice,
        maxFeePerGas: gasPrice,
        gasPrice: gasPrice,
    };
}
export function parseGwei(num) {
    if (typeof num !== "number") {
        num = Number(num);
    }
    return ethers.utils.parseUnits(num.toFixed(9), "gwei");
}
//# sourceMappingURL=utils.js.map