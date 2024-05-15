import { IDbController } from "types/lib";
export declare class RocksDbController implements IDbController {
    private namespace;
    private db;
    private status;
    constructor(dbDir: string, namespace: string);
    get<T>(key: string): Promise<T>;
    put(key: string, value: Object): Promise<void>;
    del(key: string): Promise<void>;
    getMany<T>(keys: string[]): Promise<T[]>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=rocksDb.d.ts.map