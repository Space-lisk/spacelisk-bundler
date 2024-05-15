import { EventEmitter } from "events";
export var NetworkEvent;
(function (NetworkEvent) {
    NetworkEvent["peerConnected"] = "peer-manager.peer-connected";
    NetworkEvent["peerDisconnected"] = "peer-manager.peer-disconnected";
    NetworkEvent["peerMetadataReceived"] = "peer-manager.peer-metadata-received";
    NetworkEvent["gossipStart"] = "gossip.start";
    NetworkEvent["gossipStop"] = "gossip.stop";
    NetworkEvent["gossipHeartbeat"] = "gossipsub.heartbeat";
    NetworkEvent["reqRespRequest"] = "req-resp.request";
    // Network processor events
    NetworkEvent["pendingGossipsubMessage"] = "gossip.pendingGossipsubMessage";
    NetworkEvent["gossipMessageValidationResult"] = "gossip.messageValidationResult";
})(NetworkEvent || (NetworkEvent = {}));
export class NetworkEventBus extends EventEmitter {
}
//# sourceMappingURL=events.js.map