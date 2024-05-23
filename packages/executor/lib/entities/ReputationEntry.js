import { ReputationStatus } from "../../../types/lib/executor/index.js";
import { now } from "../utils/index.js";
export class ReputationEntry {
    constructor({ chainId, address, opsSeen = 0, opsIncluded = 0, lastUpdateTime = 0, }) {
        this.chainId = chainId;
        this.address = address;
        this._opsSeen = opsSeen;
        this._opsIncluded = opsIncluded;
        if (!lastUpdateTime) {
            lastUpdateTime = now();
        }
        this.lastUpdateTime = lastUpdateTime;
    }
    get opsSeen() {
        const elapsedHours = Math.floor((now() - this.lastUpdateTime) / 3600);
        const newRep = Math.floor(this._opsSeen * (1 - elapsedHours * (1 / 24)));
        return Math.max(newRep, 0);
    }
    get opsIncluded() {
        const elapsedHours = Math.floor((now() - this.lastUpdateTime) / 3600);
        const newRep = Math.floor(this._opsIncluded * (1 - elapsedHours * (1 / 24)));
        return Math.max(newRep, 0);
    }
    isBanned(minInclusionDenominator, banSlack) {
        const minExpectedIncluded = Math.floor(this.opsSeen / minInclusionDenominator);
        return minExpectedIncluded > this.opsIncluded + banSlack;
    }
    isThrottled(minInclusionDenominator, throttlingSlack) {
        const minExpectedIncluded = Math.floor(this.opsSeen / minInclusionDenominator);
        return minExpectedIncluded > this.opsIncluded + throttlingSlack;
    }
    getStatus(minInclusionDenominator, throttlingSlack, banSlack) {
        if (this.isBanned(minInclusionDenominator, banSlack)) {
            return ReputationStatus.BANNED;
        }
        if (this.isThrottled(minInclusionDenominator, throttlingSlack)) {
            return ReputationStatus.THROTTLED;
        }
        return ReputationStatus.OK;
    }
    addToReputation(opsSeen, opsIncluded) {
        this._opsSeen = this.opsSeen + opsSeen;
        this._opsIncluded = this.opsIncluded + opsIncluded;
        this.lastUpdateTime = now();
    }
    setReputation(opsSeen, opsIncluded) {
        this._opsSeen = opsSeen;
        this._opsIncluded = opsIncluded;
        this.lastUpdateTime = now();
    }
    serialize() {
        return {
            opsSeen: this._opsSeen,
            opsIncluded: this._opsIncluded,
            lastUpdateTime: this.lastUpdateTime,
        };
    }
}
//# sourceMappingURL=ReputationEntry.js.map