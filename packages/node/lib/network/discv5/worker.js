import worker from "worker_threads";
import { createFromProtobuf } from "@libp2p/peer-id-factory";
import { multiaddr } from "@multiformats/multiaddr";
import { expose } from "@chainsafe/threads/worker";
import { Observable, Subject } from "@chainsafe/threads/observable";
import { createKeypairFromPeerId, Discv5, SignableENR, } from "@chainsafe/discv5";
import { ENRKey } from "../metadata.js";
var ENRRelevance;
(function (ENRRelevance) {
    ENRRelevance["no_tcp"] = "no_tcp";
    ENRRelevance["relevant"] = "relevant";
})(ENRRelevance || (ENRRelevance = {}));
function enrRelevance(enr) {
    // We are not interested in peers that don't advertise their tcp addr
    const multiaddrTCP = enr.getLocationMultiaddr(ENRKey.tcp);
    if (!multiaddrTCP) {
        return ENRRelevance.no_tcp;
    }
    return ENRRelevance.relevant;
}
// This discv5 worker will start discv5 on initialization (there is no `start` function to call)
// A consumer _should_ call `close` before terminating the worker to cleanly exit discv5 before destroying the thread
// A `setEnrValue` function is also provided to update the host ENR key-values shared in the discv5 network.
// Cloned data from instatiation
const workerData = worker.workerData;
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
if (!workerData)
    throw Error("workerData must be defined");
const peerId = await createFromProtobuf(workerData.peerIdProto);
const keypair = createKeypairFromPeerId(peerId);
// Initialize discv5
const discv5 = Discv5.create({
    enr: new SignableENR(workerData.enr.kvs, workerData.enr.seq, keypair),
    peerId,
    multiaddr: multiaddr(workerData.bindAddr),
    config: workerData.config,
});
// Load boot enrs
for (const bootEnr of workerData.bootEnrs) {
    discv5.addEnr(bootEnr);
}
/** Used to push discovered ENRs */
const subject = new Subject();
const onDiscovered = (enr) => {
    const status = enrRelevance(enr);
    if (status === ENRRelevance.relevant) {
        subject.next(enr.toObject());
    }
};
discv5.addListener("discovered", onDiscovered);
// Discv5 will now begin accepting request/responses
await discv5.start();
const module = {
    async enr() {
        return discv5.enr.toObject();
    },
    async setEnrValue(key, value) {
        discv5.enr.set(key, value);
    },
    async kadValues() {
        return discv5.kadValues().map((enr) => enr.toObject());
    },
    async discoverKadValues() {
        discv5.kadValues().map(onDiscovered);
    },
    async findRandomNode() {
        return (await discv5.findRandomNode()).map((enr) => enr.toObject());
    },
    discovered() {
        return Observable.from(subject);
    },
    async close() {
        discv5.removeListener("discovered", onDiscovered);
        subject.complete();
        await discv5.stop();
    },
};
expose(module);
//# sourceMappingURL=worker.js.map