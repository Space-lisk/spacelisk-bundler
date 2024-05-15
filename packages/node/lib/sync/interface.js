export var SyncState;
(function (SyncState) {
    /** No useful peers are connected */
    SyncState["Stalled"] = "Stalled";
    /** The node is syncing */
    SyncState["Syncing"] = "Syncing";
    /** The node is up to date with all known peers */
    SyncState["Synced"] = "Synced";
})(SyncState || (SyncState = {}));
export var PeerSyncState;
(function (PeerSyncState) {
    /** New peer */
    PeerSyncState["New"] = "New";
    /** The peer is syncing */
    PeerSyncState["Syncing"] = "Syncing";
    /** The peer is synced */
    PeerSyncState["Synced"] = "Synced";
})(PeerSyncState || (PeerSyncState = {}));
//# sourceMappingURL=interface.js.map