import { ClientKind } from "./client.js";
export var Encoding;
(function (Encoding) {
    Encoding["SSZ_SNAPPY"] = "ssz_snappy";
})(Encoding || (Encoding = {}));
export var RelevantPeerStatus;
(function (RelevantPeerStatus) {
    RelevantPeerStatus["Unknown"] = "unknown";
    RelevantPeerStatus["relevant"] = "relevant";
    RelevantPeerStatus["irrelevant"] = "irrelevant";
})(RelevantPeerStatus || (RelevantPeerStatus = {}));
/**
 * Make data available to multiple components in the network stack.
 * Due to class dependencies some modules have circular dependencies, like PeerManager - ReqResp.
 * This third party class allows data to be available to both.
 *
 * The pruning and bounding of this class is handled by the PeerManager
 */
export class PeersData {
    constructor() {
        this.connectedPeers = new Map();
    }
    getAgentVersion(peerIdStr) {
        var _a, _b;
        return (_b = (_a = this.connectedPeers.get(peerIdStr)) === null || _a === void 0 ? void 0 : _a.agentVersion) !== null && _b !== void 0 ? _b : "NA";
    }
    getPeerKind(peerIdStr) {
        var _a, _b;
        return ((_b = (_a = this.connectedPeers.get(peerIdStr)) === null || _a === void 0 ? void 0 : _a.agentClient) !== null && _b !== void 0 ? _b : ClientKind.Unknown);
    }
    getEncodingPreference(peerIdStr) {
        var _a, _b;
        return (_b = (_a = this.connectedPeers.get(peerIdStr)) === null || _a === void 0 ? void 0 : _a.encodingPreference) !== null && _b !== void 0 ? _b : null;
    }
    setEncodingPreference(peerIdStr, encoding) {
        const peerData = this.connectedPeers.get(peerIdStr);
        if (peerData) {
            peerData.encodingPreference = encoding;
        }
    }
}
//# sourceMappingURL=peersData.js.map