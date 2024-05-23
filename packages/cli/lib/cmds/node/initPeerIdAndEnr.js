import fs from "node:fs";
import path from "node:path";
import { SignableENR, createKeypairFromPeerId } from "@chainsafe/discv5";
import { createSecp256k1PeerId } from "@libp2p/peer-id-factory";
import { defaultP2POptions } from "../../../../types/lib/options/index.js";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { peerIdFromBytes } from "@libp2p/peer-id";
import { createFromPrivKey, createFromPubKey } from "@libp2p/peer-id-factory";
import { unmarshalPrivateKey, unmarshalPublicKey } from "@libp2p/crypto/keys";
import { readFile, writeFile600Perm } from "../../util/index.js";
export function overwriteEnrWithCliArgs(enr, args) {
    const [host, enrPort] = [args["p2p.enrHost"], args["p2p.enrPort"]];
    enr.ip = host !== null && host !== void 0 ? host : defaultP2POptions.enrHost;
    enr.tcp = enrPort !== null && enrPort !== void 0 ? enrPort : defaultP2POptions.enrPort;
    enr.udp = enrPort !== null && enrPort !== void 0 ? enrPort : defaultP2POptions.enrPort;
}
export async function initPeerIdAndEnr(args, logger) {
    const { dataDir } = args;
    const retainPeerId = args["p2p.retainPeerId"];
    const newPeerIdAndENR = async () => {
        const peerId = await createSecp256k1PeerId();
        const enr = SignableENR.createV4(createKeypairFromPeerId(peerId));
        return { peerId, enr };
    };
    const readPersistedPeerIdAndENR = async (peerIdFile, enrFile) => {
        let peerId;
        let enr;
        // attempt to read stored peer id
        try {
            peerId = await readPeerId(peerIdFile);
        }
        catch (e) {
            logger.warn("Unable to read peerIdFile, creating a new peer id");
            return newPeerIdAndENR();
        }
        // attempt to read stored enr
        try {
            enr = SignableENR.decodeTxt(fs.readFileSync(enrFile, "utf-8"), createKeypairFromPeerId(peerId));
        }
        catch (e) {
            logger.warn("Unable to decode stored local ENR, creating a new ENR");
            enr = SignableENR.createV4(createKeypairFromPeerId(peerId));
            return { peerId, enr };
        }
        // check stored peer id against stored enr
        if (!peerId.equals(await enr.peerId())) {
            logger.warn("Stored local ENR doesn't match peerIdFile, creating a new ENR");
            enr = SignableENR.createV4(createKeypairFromPeerId(peerId));
            return { peerId, enr };
        }
        return { peerId, enr };
    };
    if (retainPeerId) {
        const enrFile = path.join(dataDir, "enr");
        const peerIdFile = path.join(dataDir, "peer-id.json");
        const { peerId, enr } = await readPersistedPeerIdAndENR(peerIdFile, enrFile);
        overwriteEnrWithCliArgs(enr, args);
        writeFile600Perm(peerIdFile, exportToJSON(peerId));
        writeFile600Perm(enrFile, enr.encodeTxt());
        return { peerId, enr };
    }
    else {
        const { peerId, enr } = await newPeerIdAndENR();
        overwriteEnrWithCliArgs(enr, args);
        return { peerId, enr };
    }
}
async function createFromParts(multihash, privKey, pubKey) {
    if (privKey != null) {
        const key = await unmarshalPrivateKey(privKey);
        return createFromPrivKey(key);
    }
    else if (pubKey != null) {
        const key = unmarshalPublicKey(pubKey);
        return createFromPubKey(key);
    }
    return peerIdFromBytes(multihash);
}
export function exportToJSON(peerId, excludePrivateKey) {
    return {
        id: uint8ArrayToString(peerId.toBytes(), "base58btc"),
        pubKey: peerId.publicKey != null
            ? uint8ArrayToString(peerId.publicKey, "base64pad")
            : undefined,
        privKey: excludePrivateKey === true || peerId.privateKey == null
            ? undefined
            : uint8ArrayToString(peerId.privateKey, "base64pad"),
    };
}
async function createFromJSON(obj) {
    return createFromParts(uint8ArrayFromString(obj.id, "base58btc"), obj.privKey != null
        ? uint8ArrayFromString(obj.privKey, "base64pad")
        : undefined, obj.pubKey != null
        ? uint8ArrayFromString(obj.pubKey, "base64pad")
        : undefined);
}
async function readPeerId(filepath) {
    return createFromJSON(readFile(filepath));
}
//# sourceMappingURL=initPeerIdAndEnr.js.map