import { ts } from "types/lib";
import { Config } from "executor/lib/config";
import { Executor } from "executor/lib/executor";
import { EncodedPayload } from "../../../reqresp/types";
export declare function onPooledUserOpHashes(executor: Executor, relayersConfig: Config, req: ts.PooledUserOpHashesRequest): AsyncIterable<EncodedPayload<ts.PooledUserOpHashes>>;
//# sourceMappingURL=pooledUserOpHashes.d.ts.map