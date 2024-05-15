/// <reference types="node" />
import EventEmitter from "events";
import { PeerId } from "@libp2p/interface-peer-id";
import StrictEventEmitter from "strict-event-emitter-types";
import { ENR, ENRData, IDiscv5DiscoveryInputOptions, SignableENR } from "@chainsafe/discv5";
export type Discv5Opts = {
    peerId: PeerId;
    discv5: Omit<IDiscv5DiscoveryInputOptions, "metrics" | "searchInterval" | "enabled">;
};
export type Discv5Events = {
    discovered: (enr: ENR) => void;
};
declare const Discv5Worker_base: new () => StrictEventEmitter<EventEmitter, Discv5Events>;
/**
 * Wrapper class abstracting the details of discv5 worker instantiation and message-passing
 */
export declare class Discv5Worker extends Discv5Worker_base {
    private opts;
    private status;
    private keypair;
    constructor(opts: Discv5Opts);
    start(): Promise<void>;
    stop(): Promise<void>;
    onDiscovered(obj: ENRData): void;
    enr(): Promise<SignableENR>;
    setEnrValue(key: string, value: Uint8Array): Promise<void>;
    kadValues(): Promise<ENR[]>;
    discoverKadValues(): Promise<void>;
    findRandomNode(): Promise<ENR[]>;
    private decodeEnrs;
    private decodeEnr;
}
export {};
//# sourceMappingURL=index.d.ts.map