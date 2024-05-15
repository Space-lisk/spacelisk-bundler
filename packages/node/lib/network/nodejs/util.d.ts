import { PeerId } from "@libp2p/interface-peer-id";
import { Libp2p } from "../interface";
import { INetworkOptions } from "../../options";
export type NodeJsLibp2pOpts = {
    peerStoreDir?: string;
    disablePeerDiscovery?: boolean;
    metrics?: boolean;
};
/**
 *
 * @param peerIdOrPromise Create an instance of NodejsNode asynchronously
 * @param networkOpts
 * @param peerStoreDir
 */
export declare function createNodeJsLibp2p(peerIdOrPromise: PeerId | Promise<PeerId>, networkOpts?: Partial<INetworkOptions>, nodeJsLibp2pOpts?: NodeJsLibp2pOpts): Promise<Libp2p>;
//# sourceMappingURL=util.d.ts.map