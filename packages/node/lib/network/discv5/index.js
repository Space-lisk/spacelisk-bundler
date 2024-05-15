import EventEmitter from "events";
import { exportToProtobuf } from "@libp2p/peer-id-factory";
import { createKeypairFromPeerId, ENR, SignableENR, } from "@chainsafe/discv5";
import { spawn, Thread, Worker } from "@chainsafe/threads";
/**
 * Wrapper class abstracting the details of discv5 worker instantiation and message-passing
 */
export class Discv5Worker extends EventEmitter {
    constructor(opts) {
        super();
        this.opts = opts;
        // this.logger = opts.logger;
        this.status = { status: "stopped" };
        this.keypair = createKeypairFromPeerId(this.opts.peerId);
    }
    async start() {
        if (this.status.status === "started")
            return;
        this.keypair = createKeypairFromPeerId(await this.opts.discv5.enr.peerId());
        const workerData = {
            enr: this.opts.discv5.enr.toObject(),
            peerIdProto: exportToProtobuf(
            //this.opts.peerId
            await this.opts.discv5.enr.peerId()),
            bindAddr: this.opts.discv5.bindAddr,
            config: this.opts.discv5,
            bootEnrs: this.opts.discv5.bootEnrs,
        };
        const worker = new Worker("./worker.js", {
            workerData,
        });
        const workerApi = await spawn(worker, {
            timeout: 5 * 60 * 1000,
        });
        const subscription = workerApi
            .discovered()
            .subscribe((enrObj) => this.onDiscovered(enrObj));
        this.status = { status: "started", workerApi, subscription };
    }
    async stop() {
        if (this.status.status === "stopped")
            return;
        this.status.subscription.unsubscribe();
        await this.status.workerApi.close();
        await Thread.terminate(this.status.workerApi);
        this.status = { status: "stopped" };
    }
    onDiscovered(obj) {
        const enr = this.decodeEnr(obj);
        if (enr) {
            this.emit("discovered", enr);
        }
    }
    async enr() {
        if (this.status.status === "started") {
            const obj = await this.status.workerApi.enr();
            return new SignableENR(obj.kvs, obj.seq, this.keypair);
        }
        else {
            throw new Error("Cannot get enr before module is started");
        }
    }
    async setEnrValue(key, value) {
        if (this.status.status === "started") {
            await this.status.workerApi.setEnrValue(key, value);
        }
        else {
            throw new Error("Cannot setEnrValue before module is started");
        }
    }
    async kadValues() {
        if (this.status.status === "started") {
            return this.decodeEnrs(await this.status.workerApi.kadValues());
        }
        else {
            return [];
        }
    }
    async discoverKadValues() {
        if (this.status.status === "started") {
            await this.status.workerApi.discoverKadValues();
        }
    }
    async findRandomNode() {
        if (this.status.status === "started") {
            return this.decodeEnrs(await this.status.workerApi.findRandomNode());
        }
        else {
            return [];
        }
    }
    decodeEnrs(objs) {
        const enrs = [];
        for (const obj of objs) {
            const enr = this.decodeEnr(obj);
            if (enr) {
                enrs.push(enr);
            }
        }
        return enrs;
    }
    decodeEnr(obj) {
        return new ENR(obj.kvs, obj.seq, obj.signature);
    }
}
//# sourceMappingURL=index.js.map