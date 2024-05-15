export declare const CustomRPCMethods: {
    skandha_getGasPrice: string;
    skandha_config: string;
    skandha_feeHistory: string;
    skandha_peers: string;
    skandha_userOperationStatus: string;
    skandha_subscribe: string;
    skandha_unsubscribe: string;
};
export declare const BundlerRPCMethods: {
    eth_chainId: string;
    eth_supportedEntryPoints: string;
    eth_sendUserOperation: string;
    eth_estimateUserOperationGas: string;
    eth_getUserOperationReceipt: string;
    eth_getUserOperationByHash: string;
    web3_clientVersion: string;
    debug_bundler_clearState: string;
    debug_bundler_dumpMempool: string;
    debug_bundler_dumpMempoolRaw: string;
    debug_bundler_setReputation: string;
    debug_bundler_dumpReputation: string;
    debug_bundler_setBundlingMode: string;
    debug_bundler_setBundleInterval: string;
    debug_bundler_sendBundleNow: string;
    debug_bundler_setMempool: string;
    debug_bundler_getStakeStatus: string;
    debug_bundler_clearMempool: string;
};
export declare const RedirectedRPCMethods: {
    web3_sha3: string;
    net_version: string;
    net_listening: string;
    net_peerCount: string;
    eth_protocolVersion: string;
    eth_gasPrice: string;
    eth_blockNumber: string;
    eth_getBalance: string;
    eth_getStorageAt: string;
    eth_getTransactionCount: string;
    eth_getBlockTransactionCountByHash: string;
    eth_getBlockTransactionCountByNumber: string;
    eth_getUncleCountByBlockHash: string;
    eth_getUncleCountByBlockNumber: string;
    eth_getCode: string;
    eth_sign: string;
    eth_call: string;
    eth_estimateGas: string;
    eth_getBlockByHash: string;
    eth_getBlockByNumber: string;
    eth_getTransactionByHash: string;
    eth_getTransactionByBlockHashAndIndex: string;
    eth_getTransactionByBlockNumberAndIndex: string;
    eth_getTransactionReceipt: string;
    eth_getUncleByBlockHashAndIndex: string;
    eth_getUncleByBlockNumberAndIndex: string;
    eth_newFilter: string;
    eth_newBlockFilter: string;
    eth_newPendingTransactionFilter: string;
    eth_uninstallFilter: string;
    eth_getFilterChanges: string;
    eth_getFilterLogs: string;
    eth_getLogs: string;
    eth_maxPriorityFeePerGas: string;
    eth_sendRawTransaction: string;
};
export declare enum HttpStatus {
    OK = 200,
    INTERNAL_SERVER_ERROR = 500
}
//# sourceMappingURL=constants.d.ts.map