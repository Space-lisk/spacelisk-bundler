import { ENR, SignableENR } from "@chainsafe/discv5";
import logger from "../../../../api/lib/logger.js";
import { Eth2PeerDataStore } from "../peers/datastore.js";
import { createNodejsLibp2p as _createNodejsLibp2p } from "./bundle.js";
/**
 *
 * @param peerIdOrPromise Create an instance of NodejsNode asynchronously
 * @param networkOpts
 * @param peerStoreDir
 */
export async function createNodeJsLibp2p(peerIdOrPromise, networkOpts = {}, nodeJsLibp2pOpts = {}) {
    var _a, _b, _c;
    const peerId = await Promise.resolve(peerIdOrPromise);
    const localMultiaddrs = networkOpts.localMultiaddrs || [];
    const bootMultiaddrs = networkOpts.bootMultiaddrs || [];
    const enr = (_a = networkOpts.discv5) === null || _a === void 0 ? void 0 : _a.enr;
    const { peerStoreDir, disablePeerDiscovery } = nodeJsLibp2pOpts;
    if (enr !== undefined && typeof enr !== "string") {
        if (enr instanceof SignableENR) {
            // TODO: clear if not args.nat
            // if (
            //   enr.getLocationMultiaddr("udp") &&
            //   !isLocalMultiAddr(enr.getLocationMultiaddr("udp"))
            // ) {
            //   clearMultiaddrUDP(enr);
            // }
        }
        else {
            throw Error("network.discv5.enr must be an instance of ENR");
        }
    }
    let datastore = undefined;
    if (peerStoreDir) {
        datastore = new Eth2PeerDataStore(peerStoreDir);
        await datastore.open();
    }
    // Append discv5.bootEnrs to bootMultiaddrs if requested
    logger.debug(`ip: ${((_b = networkOpts.discv5) === null || _b === void 0 ? void 0 : _b.enr).ip}`);
    logger.debug(`tcp: ${((_c = networkOpts.discv5) === null || _c === void 0 ? void 0 : _c.enr).tcp}`);
    if (networkOpts.connectToDiscv5Bootnodes) {
        if (!networkOpts.bootMultiaddrs) {
            networkOpts.bootMultiaddrs = [];
        }
        if (!networkOpts.discv5) {
            throw new Error("Could not initialize discv5");
        }
        for (const enrOrStr of networkOpts.discv5.bootEnrs) {
            const enr = typeof enrOrStr === "string" ? ENR.decodeTxt(enrOrStr) : enrOrStr;
            const fullMultiAddr = await enr.getFullMultiaddr("tcp");
            logger.debug(`${enrOrStr}, ${fullMultiAddr}`);
            const multiaddrWithPeerId = fullMultiAddr === null || fullMultiAddr === void 0 ? void 0 : fullMultiAddr.toString();
            if (multiaddrWithPeerId) {
                networkOpts.bootMultiaddrs.push(multiaddrWithPeerId);
            }
        }
    }
    return _createNodejsLibp2p({
        peerId,
        addresses: { listen: localMultiaddrs },
        datastore,
        bootMultiaddrs: bootMultiaddrs,
        maxConnections: networkOpts.maxPeers,
        minConnections: networkOpts.targetPeers,
        // If peer discovery is enabled let the default in NodejsNode
        peerDiscovery: disablePeerDiscovery ? [] : undefined,
        skandhaVersion: networkOpts.version,
        mdns: networkOpts.mdns,
    });
}
//# sourceMappingURL=util.js.map