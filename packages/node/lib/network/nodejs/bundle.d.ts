import { PeerId } from "@libp2p/interface-peer-id";
import { Datastore } from "interface-datastore";
import type { PeerDiscovery } from "@libp2p/interface-peer-discovery";
import type { Components } from "libp2p/components";
import { Libp2p } from "../interface";
export type Libp2pOptions = {
    peerId: PeerId;
    addresses: {
        listen: string[];
        announce?: string[];
    };
    datastore?: Datastore;
    peerDiscovery?: ((components: Components) => PeerDiscovery)[];
    bootMultiaddrs?: string[];
    maxConnections?: number;
    minConnections?: number;
    skandhaVersion?: string;
    mdns?: boolean;
};
export declare function createNodejsLibp2p(options: Libp2pOptions): Promise<Libp2p>;
//# sourceMappingURL=bundle.d.ts.map