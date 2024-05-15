export * from "./interfaces.js";
export * from "./utils.js";
import { getArbitrumGasFee } from "./arbitrum.js";
import { getMaticGasFee } from "./matic.js";
import { getMumbaiGasFee } from "./mumbai.js";
import { getOptimismGasFee } from "./optimism.js";
import { getMantleGasFee } from "./mantle.js";
import { getBaseGasFee } from "./base.js";
import { getAncient8GasFee } from "./ancient8.js";
export const oracles = {
    137: getMaticGasFee,
    80001: getMumbaiGasFee,
    10: getOptimismGasFee,
    42161: getArbitrumGasFee,
    5000: getMantleGasFee,
    5001: getMantleGasFee,
    8453: getBaseGasFee,
    888888888: getAncient8GasFee,
};
//# sourceMappingURL=index.js.map