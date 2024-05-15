import { PeerId } from "@libp2p/interface-peer-id";
import { ts } from "types/lib";
import { ClientKind } from "./client";
export declare enum Encoding {
    SSZ_SNAPPY = "ssz_snappy"
}
export declare enum RelevantPeerStatus {
    Unknown = "unknown",
    relevant = "relevant",
    irrelevant = "irrelevant"
}
export type PeerData = {
    lastReceivedMsgUnixTsMs: number;
    lastStatusUnixTsMs: number;
    connectedUnixTsMs: number;
    relevantStatus: RelevantPeerStatus;
    direction: "inbound" | "outbound";
    peerId: PeerId;
    metadata: ts.Metadata | null;
    agentVersion: string | null;
    agentClient: ClientKind | null;
    encodingPreference: Encoding | null;
};
/**
 * Make data available to multiple components in the network stack.
 * Due to class dependencies some modules have circular dependencies, like PeerManager - ReqResp.
 * This third party class allows data to be available to both.
 *
 * The pruning and bounding of this class is handled by the PeerManager
 */
export declare class PeersData {
    readonly connectedPeers: Map<string, PeerData>;
    getAgentVersion(peerIdStr: string): string;
    getPeerKind(peerIdStr: string): ClientKind;
    getEncodingPreference(peerIdStr: string): Encoding | null;
    setEncodingPreference(peerIdStr: string, encoding: Encoding): void;
}
//# sourceMappingURL=peersData.d.ts.map