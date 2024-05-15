export var GoodByeReasonCode;
(function (GoodByeReasonCode) {
    GoodByeReasonCode[GoodByeReasonCode["CLIENT_SHUTDOWN"] = 1] = "CLIENT_SHUTDOWN";
    GoodByeReasonCode[GoodByeReasonCode["IRRELEVANT_NETWORK"] = 2] = "IRRELEVANT_NETWORK";
    GoodByeReasonCode[GoodByeReasonCode["ERROR"] = 3] = "ERROR";
    GoodByeReasonCode[GoodByeReasonCode["TOO_MANY_PEERS"] = 129] = "TOO_MANY_PEERS";
    GoodByeReasonCode[GoodByeReasonCode["SCORE_TOO_LOW"] = 250] = "SCORE_TOO_LOW";
    GoodByeReasonCode[GoodByeReasonCode["BANNED"] = 251] = "BANNED";
})(GoodByeReasonCode || (GoodByeReasonCode = {}));
export const GOODBYE_KNOWN_CODES = {
    0: "Unknown",
    // spec-defined codes
    1: "Client shutdown",
    2: "Irrelevant network",
    3: "Internal fault/error",
    // Teku-defined codes
    128: "Unable to verify network",
    // Lighthouse-defined codes
    129: "Client has too many peers",
    250: "Peer score too low",
    251: "Peer banned this node",
};
/** Until js-libp2p types its events */
export var Libp2pEvent;
(function (Libp2pEvent) {
    Libp2pEvent["peerConnect"] = "peer:connect";
    Libp2pEvent["peerDisconnect"] = "peer:disconnect";
})(Libp2pEvent || (Libp2pEvent = {}));
//# sourceMappingURL=network.js.map