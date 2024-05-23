import { SignableENR, createKeypairFromPeerId, } from "@chainsafe/discv5";
import { defaultP2POptions } from "../../../types/lib/options/index.js";
import { createSecp256k1PeerId } from "@libp2p/peer-id-factory";
export const defaultP2PHost = "127.0.0.1";
export const defaultP2PPort = 4337;
export const initNetworkOptions = (enr, p2pOptions, dataDir) => {
    const discv5Options = {
        bindAddr: `/ip4/${p2pOptions.host}/udp/${p2pOptions.enrPort}`,
        enr: enr,
        bootEnrs: p2pOptions.bootEnrs,
        enrUpdate: true,
        enabled: true,
    };
    const networkOptions = {
        maxPeers: 55, // Allow some room above targetPeers for new inbound peers
        targetPeers: 50,
        discv5FirstQueryDelayMs: 1000,
        localMultiaddrs: [`/ip4/${p2pOptions.host}/tcp/${p2pOptions.port}`],
        bootMultiaddrs: [],
        mdns: false,
        discv5: discv5Options,
        connectToDiscv5Bootnodes: true,
        dataDir,
    };
    return networkOptions;
};
const randomPeerId = await createSecp256k1PeerId();
export const defaultNetworkOptions = initNetworkOptions(SignableENR.createV4(createKeypairFromPeerId(randomPeerId)), defaultP2POptions, "");
//# sourceMappingURL=network.js.map