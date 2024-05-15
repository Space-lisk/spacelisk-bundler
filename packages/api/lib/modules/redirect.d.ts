import { Config } from "executor/lib/config";
export declare class RedirectAPI {
    private config;
    private provider;
    constructor(config: Config);
    redirect(method: string, params: any[]): Promise<any>;
}
//# sourceMappingURL=redirect.d.ts.map