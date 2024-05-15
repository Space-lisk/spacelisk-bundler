import { StorageMap } from "../interfaces";
/**
/ * merge all validationStorageMap objects into merged map
 * - entry with "root" (string) is always preferred over entry with slot-map
 * - merge slot entries
 * NOTE: slot values are supposed to be the value before the transaction started.
 *  so same address/slot in different validations should carry the same value
 * @param mergedStorageMap
 * @param validationStorageMap
 */
export declare function mergeStorageMap(mergedStorageMap: StorageMap, validationStorageMap: StorageMap): StorageMap;
//# sourceMappingURL=mergeStorageMap.d.ts.map