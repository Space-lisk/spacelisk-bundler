export type INetworkParams = {
    CHAIN_ID: number;
    ENTRY_POINT_CONTRACT: Uint8Array[];
    CANONICAL_MEMPOOL?: Uint8Array;
};
export type IMempoolParams = {
    entrypoint: string;
};
export type IMempoolsConfig = Partial<Record<number, Record<string, IMempoolParams>>>;
//# sourceMappingURL=index.d.ts.map