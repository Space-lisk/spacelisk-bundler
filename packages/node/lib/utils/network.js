import os from "node:os";
// peers
/**
 * Check if multiaddr belongs to the local network interfaces.
 */
export function isLocalMultiAddr(multiaddr) {
    if (!multiaddr)
        return false;
    const protoNames = multiaddr.protoNames();
    if (protoNames.length !== 2 && protoNames[1] !== "udp") {
        throw new Error("Invalid udp multiaddr");
    }
    const interfaces = os.networkInterfaces();
    const tuples = multiaddr.tuples();
    const family = tuples[0][0];
    const isIPv4 = family === 4;
    const ip = tuples[0][1];
    if (!ip) {
        return false;
    }
    const ipStr = isIPv4
        ? Array.from(ip).join(".")
        : Array.from(Uint16Array.from(ip))
            .map((n) => n.toString(16))
            .join(":");
    for (const networkInterfaces of Object.values(interfaces)) {
        for (const networkInterface of networkInterfaces || []) {
            // since node version 18, the netowrkinterface family returns 4 | 6 instead of ipv4 | ipv6,
            // even though the documentation says otherwise.
            // This might be a bug that would be corrected in future version, in the meantime
            // the check using endsWith ensures things work in node version 18 and earlier
            if (String(networkInterface.family).endsWith(String(family)) &&
                networkInterface.address === ipStr) {
                return true;
            }
        }
    }
    return false;
}
export function clearMultiaddrUDP(enr) {
    // enr.multiaddrUDP = undefined in new version
    enr.delete("ip");
    enr.delete("udp");
    enr.delete("ip6");
    enr.delete("udp6");
}
export function prettyPrintPeerId(peerId) {
    const id = peerId.toString();
    return `${id.substr(0, 2)}...${id.substr(id.length - 6, id.length)}`;
}
/**
 * Get the connections map from a connection manager
 */
// Compat function for type mismatch reasons
export function getConnectionsMap(connectionManager) {
    return connectionManager["connections"];
}
export function getConnection(connectionManager, peerIdStr) {
    var _a, _b;
    return (_b = (_a = getConnectionsMap(connectionManager).get(peerIdStr)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : undefined;
}
// https://github.com/ChainSafe/js-libp2p-gossipsub/blob/3475242ed254f7647798ab7f36b21909f6cb61da/src/index.ts#L2009
export function isPublishToZeroPeersError(e) {
    return e.message.includes("PublishError.InsufficientPeers");
}
export function getDefaultDialer(libp2p) {
    return libp2p.components
        .dialer;
}
//# sourceMappingURL=network.js.map