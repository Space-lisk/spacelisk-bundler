import { IDbController } from "types/lib";
export declare class LocalDbController implements IDbController {
    private namespace;
    private status;
    private db;
    constructor(namespace: string);
    get<T>(key: string): Promise<T>;
    put(key: string, value: Object): Promise<void>;
    del(key: string): Promise<void>;
    getMany<T>(keys: string[]): Promise<T[]>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=localDb.d.ts.map