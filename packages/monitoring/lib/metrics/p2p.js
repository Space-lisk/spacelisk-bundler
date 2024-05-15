import { Counter } from "prom-client";
const useropsSent = new Counter({
    name: "skandha_p2p_user_ops_sent_counter",
    help: "Number of user ops sent over p2p",
    labelNames: ["chainId"],
});
const useropsReceived = new Counter({
    name: "skandha_p2p_user_ops_received_counter",
    help: "Number of user ops received from shared mempools",
    labelNames: ["chainId"],
});
export function createP2PMetrics(registry, chainId) {
    registry.registerMetric(useropsSent);
    registry.registerMetric(useropsReceived);
    return {
        useropsSent: useropsSent.labels({ chainId }),
        useropsReceived: useropsReceived.labels({ chainId }),
    };
}
//# sourceMappingURL=p2p.js.map