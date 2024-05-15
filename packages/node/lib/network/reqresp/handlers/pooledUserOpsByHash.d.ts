import { ts } from "types/lib";
import { Config } from "executor/lib/config";
import { Executor } from "executor/lib/executor";
import { AllChainsMetrics } from "monitoring/lib";
import { EncodedPayload } from "../../../reqresp/types";
export declare function onPooledUserOpsByHash(executor: Executor, relayersConfig: Config, req: ts.PooledUserOpsByHashRequest, metrics: AllChainsMetrics | null): AsyncIterable<EncodedPayload<ts.PooledUserOpsByHash>>;
//# sourceMappingURL=pooledUserOpsByHash.d.ts.map