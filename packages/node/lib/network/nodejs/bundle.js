import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { mplex } from "@libp2p/mplex";
import { bootstrap } from "@libp2p/bootstrap";
import { mdns } from "@libp2p/mdns";
import { createNoise } from "./noise.js";
export async function createNodejsLibp2p(options) {
    var _a, _b, _c, _d, _e;
    const peerDiscovery = [];
    if (options.peerDiscovery) {
        peerDiscovery.push(...options.peerDiscovery);
    }
    else {
        if (((_b = (_a = options.bootMultiaddrs) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0) {
            peerDiscovery.push(bootstrap({ list: (_c = options.bootMultiaddrs) !== null && _c !== void 0 ? _c : [] }));
        }
        if (options.mdns) {
            peerDiscovery.push(mdns());
        }
    }
    return (await createLibp2p({
        peerId: options.peerId,
        addresses: {
            listen: options.addresses.listen,
            announce: options.addresses.announce || [],
        },
        connectionEncryption: [createNoise()],
        // Reject connections when the server's connection count gets high
        transports: [
            tcp({
                maxConnections: options.maxConnections,
                closeServerOnMaxConnections: {
                    closeAbove: (_d = options.maxConnections) !== null && _d !== void 0 ? _d : Infinity,
                    listenBelow: (_e = options.maxConnections) !== null && _e !== void 0 ? _e : Infinity,
                },
            }),
        ],
        streamMuxers: [mplex({ maxInboundStreams: 256 })],
        peerDiscovery,
        connectionManager: {
            // dialer config
            maxParallelDials: 100,
            maxAddrsToDial: 25,
            maxDialsPerPeer: 4,
            dialTimeout: 30000,
            autoDial: false,
            maxConnections: options.maxConnections,
            minConnections: options.minConnections,
        },
        datastore: options.datastore,
        identify: {
            host: {
                agentVersion: options.skandhaVersion
                    ? `skandha/${options.skandhaVersion}`
                    : "skandha",
            },
        },
    }));
}
//# sourceMappingURL=bundle.js.map