import { RateLimiterGRCA } from "./rateLimiterGRCA.js";
/** Sometimes a peer request comes AFTER libp2p disconnect event, check for such peers every 10 minutes */
const CHECK_DISCONNECTED_PEERS_INTERVAL_MS = 10 * 60 * 1000;
/** Peers don't request us for 5 mins are considered disconnected */
const DISCONNECTED_TIMEOUT_MS = 5 * 60 * 1000;
export class ReqRespRateLimiter {
    constructor(opts) {
        var _a;
        this.opts = opts;
        this.rateLimitersPerPeer = new Map();
        this.rateLimitersTotal = new Map();
        /** Interval to check lastSeenMessagesByPeer */
        this.cleanupInterval = undefined;
        this.rateLimitMultiplier = (_a = opts === null || opts === void 0 ? void 0 : opts.rateLimitMultiplier) !== null && _a !== void 0 ? _a : 1;
        this.lastSeenRequestsByPeer = new Map();
    }
    get enabled() {
        return this.rateLimitMultiplier > 0;
    }
    initRateLimits(protocolID, rateLimits) {
        if (!this.enabled) {
            return;
        }
        if (rateLimits.byPeer) {
            this.rateLimitersPerPeer.set(protocolID, RateLimiterGRCA.fromQuota({
                quotaTimeMs: rateLimits.byPeer.quotaTimeMs,
                quota: rateLimits.byPeer.quota * this.rateLimitMultiplier,
            }));
        }
        if (rateLimits.total) {
            this.rateLimitersTotal.set(protocolID, RateLimiterGRCA.fromQuota({
                quotaTimeMs: rateLimits.total.quotaTimeMs,
                quota: rateLimits.total.quota * this.rateLimitMultiplier,
            }));
        }
    }
    allows(peerId, protocolID, requestCount) {
        var _a, _b;
        if (!this.enabled) {
            return true;
        }
        const peerIdStr = peerId.toString();
        this.lastSeenRequestsByPeer.set(peerIdStr, Date.now());
        const byPeer = this.rateLimitersPerPeer.get(protocolID);
        const total = this.rateLimitersTotal.get(protocolID);
        if ((byPeer && !byPeer.allows(peerIdStr, requestCount)) ||
            (total && !total.allows(null, requestCount))) {
            (_b = (_a = this.opts) === null || _a === void 0 ? void 0 : _a.onRateLimit) === null || _b === void 0 ? void 0 : _b.call(_a, peerId, protocolID);
            return false;
        }
        else {
            return true;
        }
    }
    prune(peerId) {
        const peerIdStr = peerId.toString();
        this.pruneByPeerIdStr(peerIdStr);
    }
    start() {
        this.cleanupInterval = setInterval(this.checkDisconnectedPeers.bind(this), CHECK_DISCONNECTED_PEERS_INTERVAL_MS);
    }
    stop() {
        if (this.cleanupInterval !== undefined) {
            clearInterval(this.cleanupInterval);
        }
    }
    pruneByPeerIdStr(peerIdStr) {
        // Check for every method and version to cleanup
        for (const method of this.rateLimitersPerPeer.values()) {
            method.pruneByKey(peerIdStr);
        }
        this.lastSeenRequestsByPeer.delete(peerIdStr);
    }
    checkDisconnectedPeers() {
        const now = Date.now();
        for (const [peerIdStr, lastSeenTime,] of this.lastSeenRequestsByPeer.entries()) {
            if (now - lastSeenTime >= DISCONNECTED_TIMEOUT_MS) {
                this.pruneByPeerIdStr(peerIdStr);
            }
        }
    }
}
//# sourceMappingURL=ReqRespRateLimiter.js.map