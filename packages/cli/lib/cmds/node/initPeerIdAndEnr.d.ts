import { SignableENR } from "@chainsafe/discv5";
import { PeerId } from "@libp2p/interface-peer-id";
import { Logger } from "api/lib/logger";
import { IGlobalArgs } from "../../options";
export type PeerIdJSON = {
    id: string;
    pubKey?: string;
    privKey?: string;
};
export declare function overwriteEnrWithCliArgs(enr: SignableENR, args: IGlobalArgs): void;
export declare function initPeerIdAndEnr(args: IGlobalArgs, logger: Logger): Promise<{
    peerId: PeerId;
    enr: SignableENR;
}>;
export declare function exportToJSON(peerId: PeerId, excludePrivateKey?: boolean): PeerIdJSON;
//# sourceMappingURL=initPeerIdAndEnr.d.ts.map