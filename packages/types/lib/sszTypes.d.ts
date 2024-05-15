import { ByteListType, ContainerType, ListCompositeType, ByteVectorType } from "@chainsafe/ssz";
export declare const MAX_CONTRACT_SIZE = 24576;
export declare const MAX_BYTE_ARRAY_SIZE = 64000;
export declare const MAX_OPS_PER_REQUEST = 4096;
export declare const MAX_MEMPOOLS_PER_BUNDLER = 20;
export declare const GOSSIP_MAX_SIZE = 1048576;
export declare const TTFB_TIMEOUT = 5;
export declare const RESP_TIMEOUT = 10;
export declare const MAX_SUPPORTED_MEMPOOLS = 1024;
export declare const MempoolId: ByteVectorType;
export declare const ChainId: import("@chainsafe/ssz").UintBigintType;
export declare const SupportedMempools: ListCompositeType<ByteVectorType>;
export declare const Metadata: ContainerType<{
    seq_number: import("@chainsafe/ssz").UintBigintType;
    supported_mempools: ListCompositeType<ByteVectorType>;
}>;
export declare const UserOp: ContainerType<{
    sender: ByteVectorType;
    nonce: import("@chainsafe/ssz").UintBigintType;
    init_code: ByteListType;
    call_data: ByteListType;
    call_gas_limit: import("@chainsafe/ssz").UintBigintType;
    verification_gas_limit: import("@chainsafe/ssz").UintBigintType;
    pre_verification_gas: import("@chainsafe/ssz").UintBigintType;
    max_fee_per_gas: import("@chainsafe/ssz").UintBigintType;
    max_priority_fee_per_gas: import("@chainsafe/ssz").UintBigintType;
    paymaster_and_data: ByteListType;
    signature: ByteListType;
}>;
export declare const VerifiedUserOperation: ContainerType<{
    user_operation: ContainerType<{
        sender: ByteVectorType;
        nonce: import("@chainsafe/ssz").UintBigintType;
        init_code: ByteListType;
        call_data: ByteListType;
        call_gas_limit: import("@chainsafe/ssz").UintBigintType;
        verification_gas_limit: import("@chainsafe/ssz").UintBigintType;
        pre_verification_gas: import("@chainsafe/ssz").UintBigintType;
        max_fee_per_gas: import("@chainsafe/ssz").UintBigintType;
        max_priority_fee_per_gas: import("@chainsafe/ssz").UintBigintType;
        paymaster_and_data: ByteListType;
        signature: ByteListType;
    }>;
    entry_point: ByteVectorType;
    verified_at_block_hash: import("@chainsafe/ssz").UintBigintType;
}>;
export declare const PooledUserOps: ContainerType<{
    mempool_id: ByteVectorType;
    user_operations: ListCompositeType<ContainerType<{
        sender: ByteVectorType;
        nonce: import("@chainsafe/ssz").UintBigintType;
        init_code: ByteListType;
        call_data: ByteListType;
        call_gas_limit: import("@chainsafe/ssz").UintBigintType;
        verification_gas_limit: import("@chainsafe/ssz").UintBigintType;
        pre_verification_gas: import("@chainsafe/ssz").UintBigintType;
        max_fee_per_gas: import("@chainsafe/ssz").UintBigintType;
        max_priority_fee_per_gas: import("@chainsafe/ssz").UintBigintType;
        paymaster_and_data: ByteListType;
        signature: ByteListType;
    }>>;
}>;
export declare const Status: ContainerType<{
    chain_id: import("@chainsafe/ssz").UintBigintType;
    block_hash: ByteVectorType;
    block_number: import("@chainsafe/ssz").UintBigintType;
}>;
export declare const Goodbye: import("@chainsafe/ssz").UintBigintType;
export declare const Ping: import("@chainsafe/ssz").UintBigintType;
export declare const PooledUserOpHashesRequest: ContainerType<{
    cursor: ByteVectorType;
}>;
export declare const PooledUserOpHashes: ContainerType<{
    next_cursor: ByteVectorType;
    hashes: ListCompositeType<ByteVectorType>;
}>;
export declare const PooledUserOpsByHashRequest: ContainerType<{
    hashes: ListCompositeType<ByteVectorType>;
}>;
export declare const PooledUserOpsByHash: ListCompositeType<ContainerType<{
    sender: ByteVectorType;
    nonce: import("@chainsafe/ssz").UintBigintType;
    init_code: ByteListType;
    call_data: ByteListType;
    call_gas_limit: import("@chainsafe/ssz").UintBigintType;
    verification_gas_limit: import("@chainsafe/ssz").UintBigintType;
    pre_verification_gas: import("@chainsafe/ssz").UintBigintType;
    max_fee_per_gas: import("@chainsafe/ssz").UintBigintType;
    max_priority_fee_per_gas: import("@chainsafe/ssz").UintBigintType;
    paymaster_and_data: ByteListType;
    signature: ByteListType;
}>>;
//# sourceMappingURL=sszTypes.d.ts.map