export var MempoolEntryStatus;
(function (MempoolEntryStatus) {
    MempoolEntryStatus[MempoolEntryStatus["New"] = 0] = "New";
    MempoolEntryStatus[MempoolEntryStatus["Pending"] = 1] = "Pending";
    MempoolEntryStatus[MempoolEntryStatus["Submitted"] = 2] = "Submitted";
    MempoolEntryStatus[MempoolEntryStatus["OnChain"] = 3] = "OnChain";
    MempoolEntryStatus[MempoolEntryStatus["Finalized"] = 4] = "Finalized";
    MempoolEntryStatus[MempoolEntryStatus["Cancelled"] = 5] = "Cancelled";
    MempoolEntryStatus[MempoolEntryStatus["Reverted"] = 6] = "Reverted";
})(MempoolEntryStatus || (MempoolEntryStatus = {}));
//# sourceMappingURL=MempoolEntry.js.map