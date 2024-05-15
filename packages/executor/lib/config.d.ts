import { Wallet, providers } from "ethers";
import { ConfigOptions, NetworkConfig } from "./interfaces";
export declare class Config {
    testingMode: boolean;
    unsafeMode: boolean;
    redirectRpc: boolean;
    config: NetworkConfig;
    chainId: number;
    constructor(options: ConfigOptions);
    static init(configOptions: ConfigOptions): Promise<Config>;
    getNetworkProvider(): providers.JsonRpcProvider;
    getRelayers(): Wallet[] | providers.JsonRpcSigner[] | null;
    getBeneficiary(): string | null;
    getNetworkConfig(): NetworkConfig;
    getCanonicalMempool(): {
        entryPoint: string;
        mempoolId: string;
    };
    fetchChainId(): Promise<void>;
    isEntryPointSupported(entryPoint: string): boolean;
    private getDefaultNetworkConfig;
}
//# sourceMappingURL=config.d.ts.map