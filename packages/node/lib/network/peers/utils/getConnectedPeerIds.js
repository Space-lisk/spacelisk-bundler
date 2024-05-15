import { getConnectionsMap } from "../../../utils/index.js";
/**
 * Return peers with at least one connection in status "open"
 */
export function getConnectedPeerIds(libp2p) {
    const peerIds = [];
    for (const connections of getConnectionsMap(libp2p.connectionManager).values()) {
        const openConnection = connections.find(isConnectionOpen);
        if (openConnection) {
            peerIds.push(openConnection.remotePeer);
        }
    }
    return peerIds;
}
/**
 * Efficiently check if there is at least one peer connected
 */
export function hasSomeConnectedPeer(libp2p) {
    for (const connections of getConnectionsMap(libp2p.connectionManager).values()) {
        if (connections.some(isConnectionOpen)) {
            return true;
        }
    }
    return false;
}
function isConnectionOpen(connection) {
    return connection.stat.status === "OPEN";
}
//# sourceMappingURL=getConnectedPeerIds.js.map