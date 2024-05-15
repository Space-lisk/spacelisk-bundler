import { Discv5, ENRData, SignableENRData } from "@chainsafe/discv5";
import { Observable } from "@chainsafe/threads/observable";
type Discv5Config = Parameters<(typeof Discv5)["create"]>[0]["config"];
/** discv5 worker constructor data */
export interface Discv5WorkerData {
    enr: SignableENRData;
    peerIdProto: Uint8Array;
    bindAddr: string;
    config: Discv5Config;
    bootEnrs: string[];
}
/**
 * API exposed by the discv5 worker
 *
 * Note: ENRs are represented as bytes to facilitate message-passing
 */
export type Discv5WorkerApi = {
    /** The current host ENR */
    enr(): Promise<SignableENRData>;
    /** Set a key-value of the current host ENR */
    setEnrValue(key: string, value: Uint8Array): Promise<void>;
    /** Return the ENRs currently in the kad table */
    kadValues(): Promise<ENRData[]>;
    /** emit the ENRs currently in the kad table */
    discoverKadValues(): Promise<void>;
    /** Begin a random search through the DHT, return discovered ENRs */
    findRandomNode(): Promise<ENRData[]>;
    /** Stream of discovered ENRs */
    discovered(): Observable<ENRData>;
    /** tear down discv5 resources */
    close(): Promise<void>;
};
export {};
//# sourceMappingURL=types.d.ts.map