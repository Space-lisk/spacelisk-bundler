import { onStatus } from "./status.js";
import { onPooledUserOpHashes } from "./pooledUserOpHashes.js";
import { onPooledUserOpsByHash } from "./pooledUserOpsByHash.js";
export function getReqRespHandlers(executor, config, metrics) {
    return {
        async *onStatus() {
            yield* onStatus(config);
        },
        async *onPooledUserOpHashes(req) {
            yield* onPooledUserOpHashes(executor, config, req);
        },
        async *onPooledUserOpsByHash(req) {
            yield* onPooledUserOpsByHash(executor, config, req, metrics);
        },
    };
}
//# sourceMappingURL=index.js.map