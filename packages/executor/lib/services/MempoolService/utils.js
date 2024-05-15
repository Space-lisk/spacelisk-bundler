import { MempoolEntry } from "../../entities/MempoolEntry.js";
export function rawEntryToMempoolEntry(raw) {
    return new MempoolEntry({
        ...raw
    });
}
//# sourceMappingURL=utils.js.map