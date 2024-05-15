import { BigNumber } from "ethers";
import { AddressZero } from "params/lib/index.js";
import RpcError from "types/lib/api/errors/rpc-error.js";
import { IEntryPoint__factory, IAccount__factory, IAggregatedAccount__factory, IAggregator__factory, IPaymaster__factory, SenderCreator__factory, } from "types/lib/executor/contracts/index.js";
import * as RpcErrorCodes from "types/lib/api/errors/rpc-error-codes.js";
import { Interface, hexZeroPad, hexlify, keccak256 } from "ethers/lib/utils.js";
import { getAddr } from "../../utils/index.js";
export function nonGethErrorHandler(epContract, errorResult) {
    try {
        let { error } = errorResult;
        if (error && error.error) {
            error = error.error;
        }
        if (error && error.code == -32015 && error.data.startsWith("Reverted ")) {
            /** NETHERMIND */
            const parsed = epContract.interface.parseError(error.data.slice(9));
            errorResult = {
                ...parsed,
                errorName: parsed.name,
                errorArgs: parsed.args,
            };
        }
        else if (error && error.code == -32603 && error.data) {
            /** BIFROST */
            const parsed = epContract.interface.parseError(error.data);
            errorResult = {
                ...parsed,
                errorName: parsed.name,
                errorArgs: parsed.args,
            };
        }
    }
    catch (err) {
        /* empty */
    }
    return errorResult;
}
export function parseErrorResult(userOp, errorResult) {
    var _a, _b, _c, _d;
    if (!((_a = errorResult === null || errorResult === void 0 ? void 0 : errorResult.errorName) === null || _a === void 0 ? void 0 : _a.startsWith("ValidationResult"))) {
        // parse it as FailedOp
        // if its FailedOp, then we have the paymaster param... otherwise its an Error(string)
        let paymaster = (_b = errorResult.errorArgs) === null || _b === void 0 ? void 0 : _b.paymaster;
        if (paymaster === AddressZero) {
            paymaster = undefined;
        }
        // eslint-disable-next-line
        const msg = (_d = (_c = errorResult.errorArgs) === null || _c === void 0 ? void 0 : _c.reason) !== null && _d !== void 0 ? _d : errorResult.toString();
        if (paymaster == null) {
            throw new RpcError(msg, RpcErrorCodes.VALIDATION_FAILED);
        }
        else {
            throw new RpcError(msg, RpcErrorCodes.REJECTED_BY_PAYMASTER, {
                paymaster,
            });
        }
    }
    const { returnInfo, senderInfo, factoryInfo, paymasterInfo, aggregatorInfo, // may be missing (exists only SimulationResultWithAggregator
     } = errorResult.errorArgs;
    // extract address from "data" (first 20 bytes)
    // add it as "addr" member to the "stakeinfo" struct
    // if no address, then return "undefined" instead of struct.
    function fillEntity(data, info) {
        const addr = getAddr(data);
        return addr == null
            ? undefined
            : {
                ...info,
                addr,
            };
    }
    return {
        returnInfo,
        senderInfo: {
            ...senderInfo,
            addr: userOp.sender,
        },
        factoryInfo: fillEntity(userOp.initCode, factoryInfo),
        paymasterInfo: fillEntity(userOp.paymasterAndData, paymasterInfo),
        aggregatorInfo: fillEntity(aggregatorInfo === null || aggregatorInfo === void 0 ? void 0 : aggregatorInfo.actualAggregator, aggregatorInfo === null || aggregatorInfo === void 0 ? void 0 : aggregatorInfo.stakeInfo),
    };
}
export function compareBytecode(artifactBytecode, contractBytecode) {
    if (artifactBytecode.length <= 2 || contractBytecode.length <= 2)
        return 0;
    if (typeof artifactBytecode === "string")
        artifactBytecode = artifactBytecode
            // eslint-disable-next-line no-useless-escape
            .replace(/\_\_\$/g, "000")
            // eslint-disable-next-line no-useless-escape
            .replace(/\$\_\_/g, "000");
    let matchedBytes = 0;
    for (let i = 0; i < artifactBytecode.length; i++) {
        if (artifactBytecode[i] === contractBytecode[i])
            matchedBytes++;
    }
    if (isNaN(matchedBytes / artifactBytecode.length)) {
        return 0;
    }
    return matchedBytes / artifactBytecode.length;
}
export function toBytes32(b) {
    return hexZeroPad(hexlify(b).toLowerCase(), 32);
}
export function requireCond(cond, msg, code, data = undefined) {
    if (!cond) {
        throw new RpcError(msg, code, data);
    }
}
/**
 * parse all call operation in the trace.
 * notes:
 * - entries are ordered by the return (so nested call appears before its outer call
 * - last entry is top-level return from "simulateValidation". it as ret and rettype, but no type or address
 * @param tracerResults
 */
export function parseCallStack(tracerResults) {
    const abi = Object.values([
        ...IEntryPoint__factory.abi,
        ...IAccount__factory.abi,
        ...IAggregatedAccount__factory.abi,
        ...IAggregator__factory.abi,
        ...IPaymaster__factory.abi,
    ].reduce((set, entry) => {
        var _a;
        const key = `${entry.name}(${(_a = entry === null || entry === void 0 ? void 0 : entry.inputs) === null || _a === void 0 ? void 0 : _a.map((i) => i.type).join(",")})`;
        return {
            ...set,
            [key]: entry,
        };
    }, {}));
    const xfaces = new Interface(abi);
    function callCatch(x, def) {
        try {
            return x();
        }
        catch {
            return def;
        }
    }
    const out = [];
    const stack = [];
    tracerResults.calls
        .filter((x) => !x.type.startsWith("depth"))
        .forEach((c) => {
        var _a, _b;
        if (c.type.match(/REVERT|RETURN/) != null) {
            const top = (_a = stack.splice(-1)[0]) !== null && _a !== void 0 ? _a : {
                type: "top",
                method: "validateUserOp",
            };
            const returnData = c.data;
            if (top.type.match(/CREATE/) != null) {
                out.push({
                    to: top.to,
                    from: top.from,
                    type: top.type,
                    method: "",
                    return: `len=${returnData.length}`,
                });
            }
            else {
                const method = callCatch(() => xfaces.getFunction(top.method), top.method);
                if (c.type === "REVERT") {
                    const parsedError = callCatch(() => xfaces.parseError(returnData), returnData);
                    out.push({
                        to: top.to,
                        from: top.from,
                        type: top.type,
                        method: method.name,
                        value: top.value,
                        revert: parsedError,
                    });
                }
                else {
                    const ret = callCatch(() => xfaces.decodeFunctionResult(method, returnData), returnData);
                    out.push({
                        to: top.to,
                        from: top.from,
                        type: top.type,
                        value: top.value,
                        method: (_b = method.name) !== null && _b !== void 0 ? _b : method,
                        return: ret,
                    });
                }
            }
        }
        else {
            stack.push(c);
        }
    });
    // TODO: verify that stack is empty at the end.
    return out;
}
/**
 * slots associated with each entity.
 * keccak( A || ...) is associated with "A"
 * removed rule: keccak( ... || ASSOC ) (for a previously associated hash) is also associated with "A"
 *
 * @param stakeInfoEntities stake info for (factory, account, paymaster). factory and paymaster can be null.
 * @param keccak array of buffers that were given to keccak in the transaction
 */
export function parseEntitySlots(stakeInfoEntities, keccak) {
    // for each entity (sender, factory, paymaster), hold the valid slot addresses
    // valid: the slot was generated by keccak(entity || ...)
    const entitySlots = {};
    keccak.forEach((k) => {
        Object.values(stakeInfoEntities).forEach((info) => {
            var _a;
            const addr = (_a = info === null || info === void 0 ? void 0 : info.addr) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (addr == null)
                return;
            const addrPadded = toBytes32(addr);
            if (entitySlots[addr] == null) {
                entitySlots[addr] = new Set();
            }
            const currentEntitySlots = entitySlots[addr];
            if (k.startsWith(addrPadded)) {
                currentEntitySlots.add(keccak256(k));
            }
        });
    });
    return entitySlots;
}
export const callsFromEntryPointMethodSigs = {
    factory: SenderCreator__factory.createInterface().getSighash("createSender"),
    account: IAccount__factory.createInterface().getSighash("validateUserOp"),
    paymaster: IPaymaster__factory.createInterface().getSighash("validatePaymasterUserOp"),
};
// return true if the given slot is associated with the given address, given the known keccak operations:
// @param slot the SLOAD/SSTORE slot address we're testing
// @param addr - the address we try to check for association with
// @param reverseKeccak - a mapping we built for keccak values that contained the address
export function isSlotAssociatedWith(slot, addr, entitySlots) {
    const addrPadded = hexZeroPad(addr, 32).toLowerCase();
    if (slot === addrPadded) {
        return true;
    }
    const k = entitySlots[addr];
    if (k == null) {
        return false;
    }
    const slotN = BigNumber.from(slot);
    // scan all slot entries to check of the given slot is within a structure, starting at that offset.
    // assume a maximum size on a (static) structure size.
    for (const k1 of k.keys()) {
        const kn = BigNumber.from(k1);
        if (slotN.gte(kn) && slotN.lt(kn.add(128))) {
            return true;
        }
    }
    return false;
}
export function parseValidationResult(entryPointContract, userOp, data) {
    const { name: errorName, args: errorArgs } = entryPointContract.interface.parseError(data);
    const errFullName = `${errorName}(${errorArgs.toString()})`;
    const errResult = parseErrorResult(userOp, {
        errorName,
        errorArgs,
    });
    if (!errorName.includes("Result")) {
        throw new Error(errFullName);
    }
    return errResult;
}
//# sourceMappingURL=utils.js.map