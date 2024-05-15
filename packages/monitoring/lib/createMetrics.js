import { Registry } from "prom-client";
import { createChainMetrics, createP2PMetrics, } from "./metrics/index.js";
export function createMetrics(options, logger) {
    const registry = new Registry();
    const chains = {};
    function addChain(chainId) {
        const chain = createChainMetrics(registry, chainId);
        const p2p = options.p2p ? createP2PMetrics(registry, chainId) : {};
        logger.debug(`Created metrics for ${chainId}`);
        chains[chainId] = {
            ...chain,
            ...p2p,
        };
    }
    return {
        addChain,
        chains,
        registry,
    };
}
//# sourceMappingURL=createMetrics.js.map