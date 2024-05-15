import { Config } from "executor/lib/config";
import { Executor } from "executor/lib/executor";
import { AllChainsMetrics } from "monitoring/lib";
import * as protocols from "../../../reqresp/protocols";
import { EncodedPayloadSsz, HandlerTypeFromMessage } from "../../../reqresp/types";
import { ts } from "types/lib";
export interface ReqRespHandlers {
    onStatus: () => AsyncIterable<EncodedPayloadSsz<ts.Status>>;
    onPooledUserOpHashes: HandlerTypeFromMessage<typeof protocols.PooledUserOpHashes>;
    onPooledUserOpsByHash: HandlerTypeFromMessage<typeof protocols.PooledUserOpsByHash>;
}
export declare function getReqRespHandlers(executor: Executor, config: Config, metrics: AllChainsMetrics | null): ReqRespHandlers;
//# sourceMappingURL=index.d.ts.map