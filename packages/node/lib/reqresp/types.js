/**
 * The encoding of the request/response payload
 */
export var EncodedPayloadType;
(function (EncodedPayloadType) {
    EncodedPayloadType[EncodedPayloadType["ssz"] = 0] = "ssz";
    EncodedPayloadType[EncodedPayloadType["bytes"] = 1] = "bytes";
})(EncodedPayloadType || (EncodedPayloadType = {}));
export const protocolPrefix = "/account_abstraction/req";
/**
 * Available request/response encoding strategies:
 * https://github.com/ethereum/consensus-specs/blob/v1.1.10/specs/phase0/p2p-interface.md#encoding-strategies
 */
export var Encoding;
(function (Encoding) {
    Encoding["SSZ_SNAPPY"] = "ssz_snappy";
})(Encoding || (Encoding = {}));
export const CONTEXT_BYTES_FORK_DIGEST_LENGTH = 4;
export var ContextBytesType;
(function (ContextBytesType) {
    /** 0 bytes chunk, can be ignored */
    ContextBytesType[ContextBytesType["Empty"] = 0] = "Empty";
    /** A fixed-width 4 byte <context-bytes>, set to the ForkDigest matching the chunk: compute_fork_digest(fork_version, genesis_validators_root) */
    ContextBytesType[ContextBytesType["ForkDigest"] = 1] = "ForkDigest";
})(ContextBytesType || (ContextBytesType = {}));
export var LightClientServerErrorCode;
(function (LightClientServerErrorCode) {
    LightClientServerErrorCode["RESOURCE_UNAVAILABLE"] = "RESOURCE_UNAVAILABLE";
})(LightClientServerErrorCode || (LightClientServerErrorCode = {}));
//# sourceMappingURL=types.js.map