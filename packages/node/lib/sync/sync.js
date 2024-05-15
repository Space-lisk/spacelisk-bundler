import logger from "api/lib/logger.js";
import { deserializeMempoolId, isMempoolIdEqual } from "params/lib/index.js";
import { deserializeUserOp, userOpHashToString } from "params/lib/utils/userOp.js";
import { numberToBytes32 } from "params/lib/utils/cursor.js";
import { NetworkEvent } from "../network/events.js";
import { PeerMap } from "../utils/index.js";
import { PeerSyncState, SyncState, } from "./interface.js";
export class SyncService {
    constructor(modules) {
        this.peers = new PeerMap();
        this.addPeer = (peerId, status) => {
            const peer = this.peers.get(peerId);
            if (peer && peer.status != null) {
                logger.debug(`Sync service: status already added: ${peerId.toString()}`);
                return;
            }
            this.peers.set(peerId, {
                status,
                metadata: peer === null || peer === void 0 ? void 0 : peer.metadata,
                syncState: PeerSyncState.New,
            });
            logger.debug(`Sync service: added peer: ${peerId.toString()}`);
            if (peer === null || peer === void 0 ? void 0 : peer.metadata) {
                this.startSyncing();
            }
        };
        this.addPeerMetadata = (peerId, metadata) => {
            const peer = this.peers.get(peerId);
            if (peer && peer.metadata) {
                logger.debug(`Sync service: metadata already added: ${peerId.toString()}`);
                return;
            }
            this.peers.set(peerId, {
                status: peer === null || peer === void 0 ? void 0 : peer.status,
                metadata: metadata,
                syncState: PeerSyncState.New,
            });
            logger.debug(`Sync service: metadata added: ${peerId.toString()}`);
            if (peer === null || peer === void 0 ? void 0 : peer.status) {
                this.startSyncing();
            }
        };
        /**
         * Must be called by libp2p when a peer is removed from the peer manager
         */
        this.removePeer = (peerId) => {
            this.peers.delete(peerId);
        };
        this.state = SyncState.Stalled;
        this.network = modules.network;
        this.metrics = modules.metrics;
        this.executor = modules.executor;
        this.executorConfig = modules.executorConfig;
        this.network.events.on(NetworkEvent.peerConnected, this.addPeer);
        this.network.events.on(NetworkEvent.peerMetadataReceived, this.addPeerMetadata);
        this.network.events.on(NetworkEvent.peerDisconnected, this.removePeer);
    }
    close() {
        this.network.events.off(NetworkEvent.peerConnected, this.addPeer);
        this.network.events.off(NetworkEvent.peerDisconnected, this.removePeer);
    }
    isSyncing() {
        return this.state === SyncState.Syncing;
    }
    isSynced() {
        return this.state === SyncState.Synced;
    }
    startSyncing() {
        logger.debug(`Sync service: attempt syncing, status = ${this.state}`);
        if (this.state === SyncState.Syncing) {
            return; // Skip, already started
        }
        this.state = SyncState.Syncing;
        void this.requestBatches();
    }
    async requestBatches() {
        var _a;
        logger.debug("Sync service: requested batches");
        for (const [peerId, peer] of this.peers.entries()) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (peer.syncState !== PeerSyncState.New || !peer.metadata) {
                continue; // Already synced;
            }
            peer.syncState = PeerSyncState.Syncing;
            try {
                for (const mempool of peer.metadata.supported_mempools) {
                    const canonicalMempool = this.executorConfig.getCanonicalMempool();
                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                    if (!isMempoolIdEqual(canonicalMempool.mempoolId, mempool)) {
                        logger.debug(`mempool not supported: ${deserializeMempoolId(mempool)}`);
                        continue;
                    }
                    const hashes = [];
                    let cursor = numberToBytes32(0);
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        const response = await this.network.pooledUserOpHashes(peerId, {
                            cursor,
                        });
                        hashes.push(...response.hashes);
                        if (response.next_cursor) {
                            cursor = response.next_cursor;
                        }
                        break;
                    }
                    if (!hashes.length) {
                        logger.debug("No hashes received");
                        break; // break the for loop and set state to synced
                    }
                    else {
                        logger.debug(`Received hashes: ${hashes.length}`);
                        logger.debug(`${hashes.map((hash) => userOpHashToString(hash)).join(", ")}`);
                    }
                    const missingHashes = [];
                    for (const hash of hashes) {
                        const exists = await this.executor.p2pService.userOpByHash(userOpHashToString(hash));
                        if (!exists) {
                            missingHashes.push(hash);
                        }
                    }
                    if (missingHashes.length === 0) {
                        logger.debug("No new hashes received");
                        break; // break the for loop and set state to synced
                    }
                    const sszUserOps = await this.network.pooledUserOpsByHash(peerId, {
                        hashes: missingHashes,
                    });
                    try {
                        for (const sszUserOp of sszUserOps) {
                            const userOp = deserializeUserOp(sszUserOp);
                            try {
                                await this.executor.eth.sendUserOperation({
                                    entryPoint: canonicalMempool.entryPoint,
                                    userOp,
                                });
                            }
                            catch (err) {
                                logger.error(err, `Could not save userop ${userOp.sender}, ${userOp.nonce}`);
                            }
                            // if metrics are enabled
                            if (this.metrics) {
                                (_a = this.metrics[this.executor.chainId].useropsReceived) === null || _a === void 0 ? void 0 : _a.inc();
                            }
                        }
                    }
                    catch (err) {
                        logger.error(err);
                    }
                }
            }
            catch (err) {
                logger.error(err);
            }
            peer.syncState = PeerSyncState.Synced; // TODO: check if syncState changes are correct
        }
        this.state = SyncState.Synced;
    }
}
//# sourceMappingURL=sync.js.map