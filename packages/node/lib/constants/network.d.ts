export declare enum GoodByeReasonCode {
    CLIENT_SHUTDOWN = 1,
    IRRELEVANT_NETWORK = 2,
    ERROR = 3,
    TOO_MANY_PEERS = 129,
    SCORE_TOO_LOW = 250,
    BANNED = 251
}
export declare const GOODBYE_KNOWN_CODES: Record<string, string>;
/** Until js-libp2p types its events */
export declare enum Libp2pEvent {
    peerConnect = "peer:connect",
    peerDisconnect = "peer:disconnect"
}
//# sourceMappingURL=network.d.ts.map