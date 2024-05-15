import { Registry, Counter } from "prom-client";
export interface IP2PMetrics {
    useropsSent: Counter.Internal;
    useropsReceived: Counter.Internal;
}
export declare function createP2PMetrics(registry: Registry, chainId: number): IP2PMetrics;
//# sourceMappingURL=p2p.d.ts.map