import { PeerId } from "@libp2p/interface-peer-id";
import { Libp2p } from "../../interface";
/**
 * Return peers with at least one connection in status "open"
 */
export declare function getConnectedPeerIds(libp2p: Libp2p): PeerId[];
/**
 * Efficiently check if there is at least one peer connected
 */
export declare function hasSomeConnectedPeer(libp2p: Libp2p): boolean;
//# sourceMappingURL=getConnectedPeerIds.d.ts.map