import { ApiOptions } from "types/lib/options";
import { IDBOptions } from "./db";
import { INetworkOptions } from "./network";
export interface IBundlerNodeOptions {
    api: ApiOptions;
    db: IDBOptions;
    network: INetworkOptions;
}
export declare const defaultOptions: IBundlerNodeOptions;
//# sourceMappingURL=bundler.d.ts.map