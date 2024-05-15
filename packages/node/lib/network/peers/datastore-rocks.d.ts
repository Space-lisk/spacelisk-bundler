/// <reference types="rocksdb" />
import { Batch, Key, KeyQuery, Pair, Query } from "interface-datastore";
import { BaseDatastore } from "datastore-core";
import rocks from "@farcaster/rocksdb";
import { AbstractOpenOptions } from "abstract-leveldown";
/**
 * A datastore backed by leveldb
 */
export declare class LevelDatastore extends BaseDatastore {
    db: rocks;
    private readonly opts;
    constructor(path: string | rocks, opts?: AbstractOpenOptions);
    open(): Promise<void>;
    put(key: Key, value: Uint8Array): Promise<void>;
    get(key: Key): Promise<Uint8Array>;
    has(key: Key): Promise<boolean>;
    delete(key: Key): Promise<void>;
    close(): Promise<void>;
    batch(): Batch;
    query(q: Query): AsyncIterable<Pair>;
    queryKeys(q: KeyQuery): AsyncIterable<Key>;
    _query(opts: {
        values: boolean;
        prefix?: string;
    }): AsyncIterable<Pair>;
}
//# sourceMappingURL=datastore-rocks.d.ts.map