import { PeerId } from "@libp2p/interface-peer-id";
import { Libp2p } from "libp2p";
import { ts } from "types/lib";
import { Logger } from "api/lib/logger";
import { AllChainsMetrics } from "monitoring/lib";
import { INetworkEventBus } from "../events";
import { MetadataController } from "../metadata";
import { PeersData } from "../peers/peersData";
import { IPeerRpcScoreStore } from "../peers/score";
import { ReqResp, ReqRespOpts } from "../../reqresp/ReqResp";
import { ProtocolDefinition } from "../../reqresp/types";
import { RequestError } from "../../reqresp/request";
import { IReqRespNode } from "./interface";
import { ReqRespMethod, RequestTypedContainer } from "./types";
import { ReqRespHandlers } from "./handlers";
export interface ReqRespNodeModules {
    libp2p: Libp2p;
    peersData: PeersData;
    logger: Logger;
    reqRespHandlers: ReqRespHandlers;
    metadata: MetadataController;
    peerRpcScores: IPeerRpcScoreStore;
    networkEventBus: INetworkEventBus;
    metrics: AllChainsMetrics | null;
}
export type ReqRespNodeOpts = ReqRespOpts;
export declare class ReqRespNode extends ReqResp implements IReqRespNode {
    private readonly reqRespHandlers;
    private readonly metadataController;
    private readonly peerRpcScores;
    private readonly networkEventBus;
    private readonly peersData;
    private readonly metrics;
    protected readonly logger: Logger;
    constructor(modules: ReqRespNodeModules, options?: ReqRespNodeOpts);
    start(): Promise<void>;
    stop(): Promise<void>;
    registerProtocols(): void;
    status(peerId: PeerId, request: ts.Status): Promise<ts.Status>;
    goodbye(peerId: PeerId, request: ts.Goodbye): Promise<void>;
    ping(peerId: PeerId): Promise<ts.Ping>;
    metadata(peerId: PeerId): Promise<ts.Metadata>;
    pooledUserOpHashes(peerId: PeerId, req: ts.PooledUserOpHashesRequest): Promise<ts.PooledUserOpHashes>;
    pooledUserOpsByHash(peerId: PeerId, req: ts.PooledUserOpsByHashRequest): Promise<ts.PooledUserOpsByHash>;
    protected sendRequest<Req, Resp>(peerId: PeerId, method: string, versions: number[], body: Req): AsyncIterable<Resp>;
    protected onIncomingRequestBody(req: RequestTypedContainer, peerId: PeerId): void;
    protected onIncomingRequest(peerId: PeerId, protocol: ProtocolDefinition): void;
    protected onOutgoingRequestError(peerId: PeerId, method: ReqRespMethod, error: RequestError): void;
    private onStatus;
    private onGoodbye;
    private onPing;
    private onMetadata;
    private onPooledUserOpHashes;
    private onPooledUserOpsByHash;
    private getProtocols;
}
//# sourceMappingURL=ReqRespNode.d.ts.map