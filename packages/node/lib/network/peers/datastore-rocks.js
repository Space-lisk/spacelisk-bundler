import { Key } from "interface-datastore";
import { BaseDatastore, Errors } from "datastore-core";
import filter from "it-filter";
import map from "it-map";
import take from "it-take";
import sort from "it-sort";
import rocks from "@farcaster/rocksdb";
/**
 * A datastore backed by leveldb
 */
export class LevelDatastore extends BaseDatastore {
    constructor(path, opts = {}) {
        super();
        this.db = typeof path === "string" ? rocks(path) : path;
        this.opts = {
            createIfMissing: true,
            compression: false, // same default as go
            ...opts,
        };
    }
    async open() {
        try {
            await new Promise((resolve, reject) => {
                this.db.open(this.opts, (err) => {
                    if (err)
                        reject(err);
                    resolve();
                });
            });
        }
        catch (err) {
            throw Errors.dbOpenFailedError(err);
        }
    }
    async put(key, value) {
        try {
            await new Promise((res, rej) => {
                this.db.put(key.toString(), JSON.stringify(value), (err) => {
                    if (err)
                        rej(err);
                    res(key);
                });
            });
        }
        catch (err) {
            throw Errors.dbWriteFailedError(err);
        }
    }
    async get(key) {
        try {
            return await new Promise((resolve, reject) => {
                this.db.get(key.toString(), (err, value) => {
                    if (err)
                        reject(err);
                    try {
                        resolve(JSON.parse(value));
                    }
                    catch (_) {
                        return resolve(value);
                    }
                });
            });
        }
        catch (err) {
            throw Errors.notFoundError(err);
        }
    }
    async has(key) {
        try {
            await new Promise((resolve, reject) => {
                this.db.get(key.toString(), (err, value) => {
                    if (err)
                        reject(err);
                    resolve(value);
                });
            });
        }
        catch (err) {
            if (err.notFound != null) {
                return false;
            }
            throw err;
        }
        return true;
    }
    async delete(key) {
        try {
            return new Promise((resolve, reject) => {
                this.db.del(key.toString(), (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        }
        catch (err) {
            throw Errors.dbDeleteFailedError(err);
        }
    }
    async close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err)
                    reject(err);
                resolve();
            });
        });
    }
    batch() {
        const ops = [];
        return {
            put: (key, value) => {
                ops.push({
                    type: "put",
                    key: key.toString(),
                    value,
                });
            },
            delete: (key) => {
                ops.push({
                    type: "del",
                    key: key.toString(),
                });
            },
            commit: async () => {
                if (this.db.batch == null) {
                    throw new Error("Batch operations unsupported by underlying Level");
                }
                await new Promise((resolve, reject) => {
                    this.db.batch(ops, (err) => {
                        if (err)
                            reject(err);
                        resolve();
                    });
                });
            },
        };
    }
    query(q) {
        let it = this._query({
            values: true,
            prefix: q.prefix,
        });
        if (Array.isArray(q.filters)) {
            it = q.filters.reduce((it, f) => filter(it, f), it);
        }
        if (Array.isArray(q.orders)) {
            it = q.orders.reduce((it, f) => sort(it, f), it);
        }
        const { offset, limit } = q;
        if (offset != null) {
            let i = 0;
            it = filter(it, () => i++ >= offset);
        }
        if (limit != null) {
            it = take(it, limit);
        }
        return it;
    }
    queryKeys(q) {
        let it = map(this._query({
            values: false,
            prefix: q.prefix,
        }), ({ key }) => key);
        if (Array.isArray(q.filters)) {
            it = q.filters.reduce((it, f) => filter(it, f), it);
        }
        if (Array.isArray(q.orders)) {
            it = q.orders.reduce((it, f) => sort(it, f), it);
        }
        const { offset, limit } = q;
        if (offset != null) {
            let i = 0;
            it = filter(it, () => i++ >= offset);
        }
        if (limit != null) {
            it = take(it, limit);
        }
        return it;
    }
    _query(opts) {
        const iteratorOpts = {
            keys: true,
            keyEncoding: "buffer",
            values: opts.values,
        };
        // Let the db do the prefix matching
        if (opts.prefix != null) {
            const prefix = opts.prefix.toString();
            // Match keys greater than or equal to `prefix` and
            iteratorOpts.gte = prefix;
            // less than `prefix` + \xFF (hex escape sequence)
            iteratorOpts.lt = prefix + "\xFF";
        }
        const iterator = this.db.iterator(iteratorOpts);
        if (iterator[Symbol.asyncIterator] != null) {
            return levelIteratorToIterator(iterator);
        }
        if (iterator.next != null && iterator.end != null) {
            return oldLevelIteratorToIterator(iterator);
        }
        throw new Error("Level returned incompatible iterator");
    }
}
async function* levelIteratorToIterator(li) {
    for await (const [key, value] of li) {
        yield { key: new Key(key, false), value };
    }
    await li.close();
}
function oldLevelIteratorToIterator(li) {
    return {
        [Symbol.asyncIterator]() {
            return {
                next: async () => await new Promise((resolve, reject) => {
                    li.next((err, key, value) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        if (key == null) {
                            li.end((err) => {
                                if (err != null) {
                                    reject(err);
                                    return;
                                }
                                resolve({ done: true, value: undefined });
                            });
                            return;
                        }
                        resolve({
                            done: false,
                            value: { key: new Key(key, false), value },
                        });
                    });
                }),
                return: async () => await new Promise((resolve, reject) => {
                    li.end((err) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        resolve({ done: true, value: undefined });
                    });
                }),
            };
        },
    };
}
//# sourceMappingURL=datastore-rocks.js.map