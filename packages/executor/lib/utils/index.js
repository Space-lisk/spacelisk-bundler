var _a;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defaultAbiCoder, hexlify, keccak256, } from "ethers/lib/utils.js";
import { IEntryPoint__factory } from "types/lib/executor/contracts/factories/index.js";
const UserOpType = (_a = IEntryPoint__factory.abi.find((entry) => entry.name === "simulateValidation").inputs) === null || _a === void 0 ? void 0 : _a[0];
if (UserOpType == null) {
    throw new Error("unable to find method simulateValidation in EntryPoint ABI");
}
/**
 * pack the userOperation
 * @param op
 * @param forSignature "true" if the hash is needed to calculate the getUserOpHash()
 *  "false" to pack entire UserOp, for calculating the calldata cost of putting it on-chain.
 */
export function packUserOp(op, forSignature = true) {
    if (forSignature) {
        return defaultAbiCoder.encode([
            "address",
            "uint256",
            "bytes32",
            "bytes32",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "bytes32",
        ], [
            op.sender,
            op.nonce,
            keccak256(op.initCode),
            keccak256(op.callData),
            op.callGasLimit,
            op.verificationGasLimit,
            op.preVerificationGas,
            op.maxFeePerGas,
            op.maxPriorityFeePerGas,
            keccak256(op.paymasterAndData),
        ]);
    }
    else {
        // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
        return defaultAbiCoder.encode([
            "address",
            "uint256",
            "bytes",
            "bytes",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "bytes",
            "bytes",
        ], [
            op.sender,
            op.nonce,
            op.initCode,
            op.callData,
            op.callGasLimit,
            op.verificationGasLimit,
            op.preVerificationGas,
            op.maxFeePerGas,
            op.maxPriorityFeePerGas,
            op.paymasterAndData,
            op.signature,
        ]);
    }
}
/**
 * calculate the userOpHash of a given userOperation.
 * The userOpHash is a hash of all UserOperation fields, except the "signature" field.
 * The entryPoint uses this value in the emitted UserOperationEvent.
 * A wallet may use this value as the hash to sign (the SampleWallet uses this method)
 * @param op
 * @param entryPoint
 * @param chainId
 */
export function getUserOpHash(op, entryPoint, chainId) {
    const userOpHash = keccak256(packUserOp(op, true));
    const enc = defaultAbiCoder.encode(["bytes32", "address", "uint256"], [userOpHash, entryPoint, chainId]);
    return keccak256(enc);
}
export function extractAddrFromInitCode(data) {
    if (data == null) {
        return undefined;
    }
    const str = hexlify(data);
    if (str.length >= 42) {
        return str.slice(0, 42);
    }
    return undefined;
}
/**
 * Unix timestamp * 1000
 * @returns time in milliseconds
 */
export function now() {
    return new Date().getTime();
}
export function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
export function getAddr(data) {
    if (data == null) {
        return undefined;
    }
    const str = hexlify(data);
    if (str.length >= 42) {
        return str.slice(0, 42);
    }
    return undefined;
}
//# sourceMappingURL=index.js.map