import type { PeerId } from "@libp2p/interface-peer-id";
import type { Multiaddr } from "@multiformats/multiaddr";
import type { Connection } from "@libp2p/interface-connection";
import type { ConnectionManager } from "@libp2p/interface-connection-manager";
import type { DefaultDialer } from "libp2p/connection-manager/dialer";
import type { SignableENR } from "@chainsafe/discv5";
import type { Libp2p } from "../network/interface";
/**
 * Check if multiaddr belongs to the local network interfaces.
 */
export declare function isLocalMultiAddr(multiaddr: Multiaddr | undefined): boolean;
export declare function clearMultiaddrUDP(enr: SignableENR): void;
export declare function prettyPrintPeerId(peerId: PeerId): string;
/**
 * Get the connections map from a connection manager
 */
export declare function getConnectionsMap(connectionManager: ConnectionManager): Map<string, Connection[]>;
export declare function getConnection(connectionManager: ConnectionManager, peerIdStr: string): Connection | undefined;
export declare function isPublishToZeroPeersError(e: Error): boolean;
export declare function getDefaultDialer(libp2p: Libp2p): DefaultDialer;
//# sourceMappingURL=network.d.ts.map