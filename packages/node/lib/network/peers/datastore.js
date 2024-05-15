import { BaseDatastore } from "datastore-core";
import { Key } from "interface-datastore";
import { LevelDatastore } from "./datastore-rocks.js";
export class Eth2PeerDataStore extends BaseDatastore {
    constructor(dbDatastore, { threshold = 5, maxMemoryItems = 50, } = {}) {
        super();
        /** Same to PersistentPeerStore of the old libp2p implementation */
        this._dirtyItems = new Set();
        if (threshold <= 0 || maxMemoryItems <= 0) {
            throw Error(`Invalid threshold ${threshold} or maxMemoryItems ${maxMemoryItems}`);
        }
        if (threshold > maxMemoryItems) {
            throw Error(`Threshold ${threshold} should be at most maxMemoryItems ${maxMemoryItems}`);
        }
        this._dbDatastore =
            typeof dbDatastore === "string"
                ? new LevelDatastore(dbDatastore)
                : dbDatastore;
        this._memoryDatastore = new Map();
        this._threshold = threshold;
        this._maxMemoryItems = maxMemoryItems;
    }
    async open() {
        return await this._dbDatastore.open();
    }
    async close() {
        return await this._dbDatastore.close();
    }
    async put(key, val) {
        return await this._put(key, val, false);
    }
    /**
     * Same interface to put with "fromDb" option, if this item is updated back from db
     * Move oldest items from memory data store to db if it's over this._maxMemoryItems
     */
    async _put(key, val, fromDb = false) {
        while (this._memoryDatastore.size >= this._maxMemoryItems) {
            // it's likely this is called only 1 time
            await this.pruneMemoryDatastore();
        }
        const keyStr = key.toString();
        const memoryItem = this._memoryDatastore.get(keyStr);
        if (memoryItem) {
            // update existing
            memoryItem.lastAccessedMs = Date.now();
            memoryItem.data = val;
        }
        else {
            // new
            this._memoryDatastore.set(keyStr, {
                data: val,
                lastAccessedMs: Date.now(),
            });
        }
        if (!fromDb)
            await this._addDirtyItem(keyStr);
    }
    /**
     * Check memory datastore - update lastAccessedMs, then db datastore
     * If found in db datastore then update back the memory datastore
     * This throws error if not found
     * see https://github.com/ipfs/js-datastore-level/blob/38f44058dd6be858e757a1c90b8edb31590ec0bc/src/index.js#L102
     */
    async get(key) {
        const keyStr = key.toString();
        const memoryItem = this._memoryDatastore.get(keyStr);
        if (memoryItem) {
            memoryItem.lastAccessedMs = Date.now();
            return memoryItem.data;
        }
        // this throws error if not found
        const dbValue = await this._dbDatastore.get(key);
        // don't call this._memoryDatastore.set directly
        // we want to get through prune() logic with fromDb as true
        await this._put(key, dbValue, true);
        return dbValue;
    }
    async has(key) {
        try {
            await this.get(key);
        }
        catch (err) {
            return false;
        }
        return true;
    }
    async delete(key) {
        this._memoryDatastore.delete(key.toString());
        await this._dbDatastore.delete(key);
    }
    async *_all(q) {
        for (const [key, value] of this._memoryDatastore.entries()) {
            yield {
                key: new Key(key),
                value: value.data,
            };
        }
        yield* this._dbDatastore.query(q);
    }
    async *_allKeys(q) {
        for (const key of this._memoryDatastore.keys()) {
            yield new Key(key);
        }
        yield* this._dbDatastore.queryKeys(q);
    }
    async _addDirtyItem(keyStr) {
        this._dirtyItems.add(keyStr);
        if (this._dirtyItems.size >= this._threshold) {
            try {
                await this._commitData();
                // eslint-disable-next-line no-empty
            }
            catch (e) { }
        }
    }
    async _commitData() {
        const batch = this._dbDatastore.batch();
        for (const keyStr of this._dirtyItems) {
            const memoryItem = this._memoryDatastore.get(keyStr);
            if (memoryItem) {
                batch.put(new Key(keyStr), memoryItem.data);
            }
        }
        await batch.commit();
        this._dirtyItems.clear();
    }
    /**
     * Prune from memory and move to db
     */
    async pruneMemoryDatastore() {
        let oldestAccessedMs = Date.now() + 1000;
        let oldestKey = undefined;
        let oldestValue = undefined;
        for (const [key, value] of this._memoryDatastore) {
            if (value.lastAccessedMs < oldestAccessedMs) {
                oldestAccessedMs = value.lastAccessedMs;
                oldestKey = key;
                oldestValue = value.data;
            }
        }
        if (oldestKey && oldestValue) {
            await this._dbDatastore.put(new Key(oldestKey), oldestValue);
            this._memoryDatastore.delete(oldestKey);
        }
    }
}
//# sourceMappingURL=datastore.js.map