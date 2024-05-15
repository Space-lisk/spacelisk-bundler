export class PeerSet {
    constructor() {
        this.peerMap = new PeerMap();
    }
    add(peer) {
        this.peerMap.set(peer, peer);
    }
    delete(peer) {
        return this.peerMap.delete(peer);
    }
    has(peer) {
        return this.peerMap.has(peer);
    }
    get size() {
        return this.peerMap.size;
    }
    values() {
        return this.peerMap.values();
    }
}
/**
 * Special ES6 Map that allows using PeerId objects as indexers
 * Also, uses a WeakMap to reduce unnecessary calls to `PeerId.toString()`
 */
export class PeerMap {
    constructor() {
        this.map = new Map();
        this.peers = new Map();
    }
    static from(peers) {
        const peerMap = new PeerMap();
        for (const peer of peers)
            peerMap.set(peer);
        return peerMap;
    }
    set(peer, value) {
        this.peers.set(this.getPeerIdString(peer), peer);
        this.map.set(this.getPeerIdString(peer), value);
    }
    get(peer) {
        return this.map.get(this.getPeerIdString(peer));
    }
    has(peer) {
        return this.map.has(this.getPeerIdString(peer));
    }
    delete(peer) {
        this.peers.delete(this.getPeerIdString(peer));
        return this.map.delete(this.getPeerIdString(peer));
    }
    get size() {
        return this.map.size;
    }
    keys() {
        return Array.from(this.peers.values());
    }
    values() {
        return Array.from(this.map.values());
    }
    entries() {
        const entries = [];
        for (const peer of this.peers.values()) {
            const value = this.get(peer);
            if (value !== undefined)
                entries.push([peer, value]);
        }
        return entries;
    }
    /**
     * Caches peerId.toString result in a WeakMap
     */
    getPeerIdString(peerId) {
        return peerId.toString();
    }
}
//# sourceMappingURL=peerMap.js.map