import { BigNumber, ethers } from "ethers";
import { getAddress, hexValue } from "ethers/lib/utils.js";
import * as RpcErrorCodes from "../../../types/lib/api/errors/rpc-error-codes.js";
import RpcError from "../../../types/lib/api/errors/rpc-error.js";
import { MempoolEntryStatus } from "../../../types/lib/executor/index.js";
import { now } from "../utils/index.js";
export class MempoolEntry {
    constructor({ chainId, userOp, entryPoint, prefund, aggregator, factory, paymaster, userOpHash, hash, lastUpdatedTime, status, transaction, actualTransaction, submitAttempts, submittedTime, revertReason, }) {
        this.chainId = chainId;
        this.userOp = userOp;
        this.entryPoint = entryPoint;
        this.prefund = prefund;
        this.userOpHash = userOpHash;
        this.aggregator = aggregator;
        this.factory = factory;
        this.paymaster = paymaster;
        this.hash = hash;
        this.lastUpdatedTime = lastUpdatedTime !== null && lastUpdatedTime !== void 0 ? lastUpdatedTime : now();
        this.submittedTime = submittedTime;
        this.status = status !== null && status !== void 0 ? status : MempoolEntryStatus.New;
        this.transaction = transaction;
        this.submitAttempts = submitAttempts !== null && submitAttempts !== void 0 ? submitAttempts : 0;
        this.actualTransaction = actualTransaction;
        this.revertReason = revertReason;
        this.validateAndTransformUserOp();
    }
    /**
     * Set status of an entry
     * If status is Pending, transaction hash is required
     */
    setStatus(status, params) {
        this.status = status;
        this.lastUpdatedTime = now();
        switch (status) {
            case MempoolEntryStatus.Pending: {
                this.transaction = params === null || params === void 0 ? void 0 : params.transaction;
                break;
            }
            case MempoolEntryStatus.Submitted: {
                this.transaction = params === null || params === void 0 ? void 0 : params.transaction;
                break;
            }
            case MempoolEntryStatus.OnChain: {
                this.actualTransaction = params === null || params === void 0 ? void 0 : params.transaction;
                break;
            }
            case MempoolEntryStatus.Reverted: {
                this.revertReason = params === null || params === void 0 ? void 0 : params.revertReason;
                break;
            }
            default: {
                // nothing
            }
        }
    }
    /**
     * To replace an entry, a new entry must have at least 10% higher maxPriorityFeePerGas
     * and 10% higher maxPriorityFeePerGas than the existingEntry
     * Returns true if Entry can replace existingEntry
     * @param entry MempoolEntry
     * @returns boolaen
     */
    canReplace(existingEntry) {
        if (!this.isEqual(existingEntry))
            return false;
        if (BigNumber.from(this.userOp.maxPriorityFeePerGas).lt(BigNumber.from(existingEntry.userOp.maxPriorityFeePerGas)
            .mul(11)
            .div(10))) {
            return false;
        }
        if (BigNumber.from(this.userOp.maxFeePerGas).lt(BigNumber.from(existingEntry.userOp.maxFeePerGas).mul(11).div(10))) {
            return false;
        }
        return true;
    }
    /**
     * To replace an entry, a new entry must have at least 10% higher maxPriorityFeePerGas
     * and 10% higher maxPriorityFeePerGas than the existingEntry
     * Returns true if Entry can replace existingEntry
     * @param entry MempoolEntry
     * @returns boolaen
     */
    canReplaceWithTTL(existingEntry, ttl) {
        if (this.lastUpdatedTime - existingEntry.lastUpdatedTime > ttl * 1000)
            return true;
        return this.canReplace(existingEntry);
    }
    isEqual(entry) {
        return (entry.chainId === this.chainId &&
            BigNumber.from(entry.userOp.nonce).eq(this.userOp.nonce) &&
            entry.userOp.sender === this.userOp.sender);
    }
    // sorts by cost in descending order
    static compareByCost(a, b) {
        const { userOp: { maxPriorityFeePerGas: aFee }, } = a;
        const { userOp: { maxPriorityFeePerGas: bFee }, } = b;
        return ethers.BigNumber.from(bFee).sub(aFee).toNumber();
    }
    validateAndTransformUserOp() {
        try {
            this.userOp.sender = getAddress(this.userOp.sender);
            this.entryPoint = getAddress(this.entryPoint);
            this.prefund = BigNumber.from(this.prefund);
            this.userOp.nonce = BigNumber.from(this.userOp.nonce);
            this.userOp.callGasLimit = BigNumber.from(this.userOp.callGasLimit);
            this.userOp.verificationGasLimit = BigNumber.from(this.userOp.verificationGasLimit);
            this.userOp.preVerificationGas = BigNumber.from(this.userOp.preVerificationGas);
            this.userOp.maxFeePerGas = BigNumber.from(this.userOp.maxFeePerGas);
            this.userOp.maxPriorityFeePerGas = BigNumber.from(this.userOp.maxPriorityFeePerGas);
        }
        catch (err) {
            throw new RpcError("Invalid UserOp", RpcErrorCodes.INVALID_USEROP, err);
        }
    }
    serialize() {
        return {
            chainId: this.chainId,
            userOp: {
                sender: getAddress(this.userOp.sender),
                nonce: hexValue(this.userOp.nonce),
                initCode: this.userOp.initCode,
                callData: this.userOp.callData,
                callGasLimit: hexValue(this.userOp.callGasLimit),
                verificationGasLimit: hexValue(this.userOp.verificationGasLimit),
                preVerificationGas: hexValue(this.userOp.preVerificationGas),
                maxFeePerGas: hexValue(this.userOp.maxFeePerGas),
                maxPriorityFeePerGas: hexValue(this.userOp.maxPriorityFeePerGas),
                paymasterAndData: this.userOp.paymasterAndData,
                signature: this.userOp.signature,
            },
            prefund: hexValue(this.prefund),
            aggregator: this.aggregator,
            factory: this.factory,
            paymaster: this.paymaster,
            hash: this.hash,
            userOpHash: this.userOpHash,
            lastUpdatedTime: this.lastUpdatedTime,
            transaction: this.transaction,
            submitAttempts: this.submitAttempts,
            status: this.status,
            submittedTime: this.submittedTime,
            actualTransaction: this.actualTransaction,
            revertReason: this.revertReason,
        };
    }
}
//# sourceMappingURL=MempoolEntry.js.map