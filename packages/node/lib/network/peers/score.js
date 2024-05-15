import { MapDef, pruneSetToMax } from "utils/lib/index.js";
import { gossipScoreThresholds, negativeGossipScoreIgnoreThreshold, } from "../gossip/scoringParameters.js";
/** The default score for new peers */
const DEFAULT_SCORE = 0;
/** The minimum reputation before a peer is disconnected */
const MIN_SCORE_BEFORE_DISCONNECT = -20;
/** The minimum reputation before a peer is banned */
const MIN_SCORE_BEFORE_BAN = -50;
/** The maximum score a peer can obtain. Update metrics.peerScore if this changes */
const MAX_SCORE = 100;
/** The minimum score a peer can obtain. Update metrics.peerScore if this changes */
const MIN_SCORE = -100;
/** Drop score if absolute value is below this threshold */
const SCORE_THRESHOLD = 1;
/** The halflife of a peer's score. I.e the number of milliseconds it takes for the score to decay to half its value */
const SCORE_HALFLIFE_MS = 10 * 60 * 1000;
const HALFLIFE_DECAY_MS = -Math.log(2) / SCORE_HALFLIFE_MS;
/** The number of milliseconds we ban a peer for before their score begins to decay */
const BANNED_BEFORE_DECAY_MS = 30 * 60 * 1000;
/** Limit of entries in the scores map */
const MAX_ENTRIES = 1000;
/**
 * We weight negative gossipsub scores in such a way that they never result in a disconnect by
 * themselves. This "solves" the problem of non-decaying gossipsub scores for disconnected peers.
 */
const GOSSIPSUB_NEGATIVE_SCORE_WEIGHT = (MIN_SCORE_BEFORE_DISCONNECT + 1) / gossipScoreThresholds.graylistThreshold;
const GOSSIPSUB_POSITIVE_SCORE_WEIGHT = GOSSIPSUB_NEGATIVE_SCORE_WEIGHT;
export var PeerAction;
(function (PeerAction) {
    /** Immediately ban peer */
    PeerAction["Fatal"] = "Fatal";
    /**
     * Not malicious action, but it must not be tolerated
     * ~5 occurrences will get the peer banned
     */
    PeerAction["LowToleranceError"] = "LowToleranceError";
    /**
     * Negative action that can be tolerated only sometimes
     * ~10 occurrences will get the peer banned
     */
    PeerAction["MidToleranceError"] = "MidToleranceError";
    /**
     * Some error that can be tolerated multiple times
     * ~50 occurrences will get the peer banned
     */
    PeerAction["HighToleranceError"] = "HighToleranceError";
})(PeerAction || (PeerAction = {}));
const peerActionScore = {
    [PeerAction.Fatal]: -(MAX_SCORE - MIN_SCORE),
    [PeerAction.LowToleranceError]: -10,
    [PeerAction.MidToleranceError]: -5,
    [PeerAction.HighToleranceError]: -1,
};
export var ScoreState;
(function (ScoreState) {
    /** We are content with the peers performance. We permit connections and messages. */
    ScoreState["Healthy"] = "Healthy";
    /** The peer should be disconnected. We allow re-connections if the peer is persistent */
    ScoreState["Disconnected"] = "Disconnected";
    /** The peer is banned. We disallow new connections until it's score has decayed into a tolerable threshold */
    ScoreState["Banned"] = "Banned";
})(ScoreState || (ScoreState = {}));
function scoreToState(score) {
    if (score <= MIN_SCORE_BEFORE_BAN)
        return ScoreState.Banned;
    if (score <= MIN_SCORE_BEFORE_DISCONNECT)
        return ScoreState.Disconnected;
    return ScoreState.Healthy;
}
/**
 * A peer's score (perceived potential usefulness).
 * This simplistic version consists of a global score per peer which decays to 0 over time.
 * The decay rate applies equally to positive and negative scores.
 */
export class PeerRpcScoreStore {
    constructor() {
        this.scores = new MapDef(() => new PeerScore());
    }
    getScore(peer) {
        var _a, _b;
        return (_b = (_a = this.scores.get(peer.toString())) === null || _a === void 0 ? void 0 : _a.getScore()) !== null && _b !== void 0 ? _b : DEFAULT_SCORE;
    }
    getGossipScore(peer) {
        var _a, _b;
        return (_b = (_a = this.scores.get(peer.toString())) === null || _a === void 0 ? void 0 : _a.getGossipScore()) !== null && _b !== void 0 ? _b : DEFAULT_SCORE;
    }
    getScoreState(peer) {
        return scoreToState(this.getScore(peer));
    }
    dumpPeerScoreStats() {
        return Array.from(this.scores.entries()).map(([peerId, peerScore]) => ({
            peerId,
            ...peerScore.getStat(),
        }));
    }
    applyAction(peer, action) {
        const peerScore = this.scores.getOrDefault(peer.toString());
        peerScore.add(peerActionScore[action]);
    }
    update() {
        // Bound size of data structures
        pruneSetToMax(this.scores, MAX_ENTRIES);
        for (const [peerIdStr, peerScore] of this.scores) {
            const newScore = peerScore.update();
            // Prune scores below threshold
            if (Math.abs(newScore) < SCORE_THRESHOLD) {
                this.scores.delete(peerIdStr);
            }
        }
    }
    updateGossipsubScore(peerId, newScore, ignore) {
        const peerScore = this.scores.getOrDefault(peerId);
        peerScore.updateGossipsubScore(newScore, ignore);
    }
}
/**
 * Manage score of a peer.
 */
export class PeerScore {
    constructor() {
        this.skandhaScore = DEFAULT_SCORE;
        this.gossipScore = DEFAULT_SCORE;
        this.score = DEFAULT_SCORE;
        this.ignoreNegativeGossipScore = false;
        this.lastUpdate = Date.now();
    }
    getScore() {
        return this.score;
    }
    getGossipScore() {
        return this.gossipScore;
    }
    add(scoreDelta) {
        let newScore = this.skandhaScore + scoreDelta;
        if (newScore > MAX_SCORE)
            newScore = MAX_SCORE;
        if (newScore < MIN_SCORE)
            newScore = MIN_SCORE;
        this.setSkandhaScore(newScore);
    }
    /**
     * Applies time-based logic such as decay rates to the score.
     * This function should be called periodically.
     *
     * Return the new score.
     */
    update() {
        const nowMs = Date.now();
        // Decay the current score
        // Using exponential decay based on a constant half life.
        const sinceLastUpdateMs = nowMs - this.lastUpdate;
        // If peer was banned, lastUpdate will be in the future
        if (sinceLastUpdateMs > 0) {
            this.lastUpdate = nowMs;
            // e^(-ln(2)/HL*t)
            const decayFactor = Math.exp(HALFLIFE_DECAY_MS * sinceLastUpdateMs);
            this.setSkandhaScore(this.skandhaScore * decayFactor);
        }
        return this.skandhaScore;
    }
    updateGossipsubScore(newScore, ignore) {
        // we only update gossipsub if last_updated is in the past which means either the peer is
        // not banned or the BANNED_BEFORE_DECAY time is over.
        if (this.lastUpdate <= Date.now()) {
            this.gossipScore = newScore;
            this.ignoreNegativeGossipScore = ignore;
        }
    }
    getStat() {
        return {
            skandhaScore: this.skandhaScore,
            gossipScore: this.gossipScore,
            ignoreNegativeGossipScore: this.ignoreNegativeGossipScore,
            score: this.score,
            lastUpdate: this.lastUpdate,
        };
    }
    setSkandhaScore(newScore) {
        this.skandhaScore = newScore;
        this.updateState();
    }
    /**
     * Compute the final score, ban peer if needed
     */
    updateState() {
        const prevState = scoreToState(this.score);
        this.recomputeScore();
        const newState = scoreToState(this.score);
        if (prevState !== ScoreState.Banned && newState === ScoreState.Banned) {
            // ban this peer for at least BANNED_BEFORE_DECAY_MS seconds
            this.lastUpdate = Date.now() + BANNED_BEFORE_DECAY_MS;
        }
    }
    /**
     * Compute the final score
     */
    recomputeScore() {
        this.score = this.skandhaScore;
        if (this.score <= MIN_SCORE_BEFORE_BAN) {
            // ignore all other scores, i.e. do nothing here
            return;
        }
        if (this.gossipScore >= 0) {
            this.score += this.gossipScore * GOSSIPSUB_POSITIVE_SCORE_WEIGHT;
        }
        else if (!this.ignoreNegativeGossipScore) {
            this.score += this.gossipScore * GOSSIPSUB_NEGATIVE_SCORE_WEIGHT;
        }
    }
}
/**
 * Utility to update gossipsub score of connected peers
 */
export function updateGossipsubScores(peerRpcScores, gossipsubScores, toIgnoreNegativePeers) {
    // sort by gossipsub score desc
    const sortedPeerIds = Array.from(gossipsubScores.keys()).sort((a, b) => { var _a, _b; return ((_a = gossipsubScores.get(b)) !== null && _a !== void 0 ? _a : 0) - ((_b = gossipsubScores.get(a)) !== null && _b !== void 0 ? _b : 0); });
    for (const peerId of sortedPeerIds) {
        const gossipsubScore = gossipsubScores.get(peerId);
        if (gossipsubScore !== undefined) {
            let ignore = false;
            if (gossipsubScore < 0 &&
                gossipsubScore > negativeGossipScoreIgnoreThreshold &&
                toIgnoreNegativePeers > 0) {
                // We ignore the negative score for the best negative peers so that their
                // gossipsub score can recover without getting disconnected.
                ignore = true;
                toIgnoreNegativePeers -= 1;
            }
            peerRpcScores.updateGossipsubScore(peerId, gossipsubScore, ignore);
        }
    }
}
//# sourceMappingURL=score.js.map