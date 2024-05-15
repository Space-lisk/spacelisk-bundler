import { IEntryPoint__factory } from "types/lib/executor/contracts/index.js";
import { BigNumber, ethers } from "ethers";
import RpcError from "types/lib/api/errors/rpc-error.js";
import * as RpcErrorCodes from "types/lib/api/errors/rpc-error-codes.js";
import { AddressZero, BytesZero, EPv6UserOpEventHash } from "params/lib/index.js";
import { GethTracer } from "../GethTracer.js";
import { callsFromEntryPointMethodSigs, isSlotAssociatedWith, parseCallStack, parseEntitySlots, parseValidationResult, } from "../utils.js";
/**
 * Some opcodes like:
 * - CREATE2
 * are not included here because they are handled elsewhere.
 * Do not include them in this list!!!
 */
const bannedOpCodes = new Set([
    "GASPRICE",
    "GASLIMIT",
    "DIFFICULTY",
    "TIMESTAMP",
    "BASEFEE",
    "BLOCKHASH",
    "NUMBER",
    "SELFBALANCE",
    "BALANCE",
    "ORIGIN",
    "GAS",
    "CREATE",
    "COINBASE",
    "SELFDESTRUCT",
    "RANDOM",
    "PREVRANDAO",
    "INVALID",
]);
// REF: https://github.com/eth-infinitism/bundler/blob/main/packages/bundler/src/modules/ValidationManager.ts
export class SafeValidationService {
    constructor(skandhaUtils, provider, reputationService, chainId, config, networkConfig, logger) {
        this.skandhaUtils = skandhaUtils;
        this.provider = provider;
        this.reputationService = reputationService;
        this.chainId = chainId;
        this.config = config;
        this.networkConfig = networkConfig;
        this.logger = logger;
        this.gethTracer = new GethTracer(this.provider);
    }
    async validateSafely(userOp, entryPoint, codehash) {
        let gasPrice = null;
        if (this.networkConfig.gasFeeInSimulation) {
            gasPrice = await this.skandhaUtils.getGasPrice();
            gasPrice.maxFeePerGas = ethers.utils.hexValue(BigNumber.from(gasPrice.maxFeePerGas));
            gasPrice.maxPriorityFeePerGas = ethers.utils.hexValue(BigNumber.from(gasPrice.maxPriorityFeePerGas));
        }
        const entryPointContract = IEntryPoint__factory.connect(entryPoint, this.provider);
        const simulationGas = BigNumber.from(userOp.preVerificationGas)
            .add(userOp.verificationGasLimit)
            .add(userOp.callGasLimit);
        const tx = {
            to: entryPoint,
            data: entryPointContract.interface.encodeFunctionData("simulateValidation", [userOp]),
            gasLimit: simulationGas,
            ...gasPrice,
        };
        const traceCall = await this.gethTracer.debug_traceCall(tx);
        const validationResult = await this.validateOpcodesAndStake(traceCall, entryPointContract, userOp);
        const { returnInfo } = validationResult;
        if (returnInfo.sigFailed) {
            throw new RpcError("Invalid UserOp signature or paymaster signature", RpcErrorCodes.INVALID_SIGNATURE);
        }
        const now = Math.floor(Date.now() / 1000);
        if (returnInfo.validUntil != null && returnInfo.validUntil < now) {
            throw new RpcError("already expired", RpcErrorCodes.USEROP_EXPIRED);
        }
        if (returnInfo.validAfter != null && returnInfo.validAfter > now + 30) {
            throw new RpcError("expires too soon", RpcErrorCodes.USEROP_EXPIRED);
        }
        if (validationResult.aggregatorInfo != null) {
            const stakeErr = await this.reputationService.checkStake(validationResult.aggregatorInfo);
            if (stakeErr.msg) {
                throw new RpcError(stakeErr.msg, RpcErrorCodes.VALIDATION_FAILED);
            }
        }
        let hash = "", addresses = [];
        try {
            const prestateTrace = await this.gethTracer.debug_traceCallPrestate(tx);
            addresses = traceCall.callsFromEntryPoint.flatMap((level) => Object.keys(level.contractSize));
            const code = addresses.map((addr) => { var _a; return (_a = prestateTrace[addr]) === null || _a === void 0 ? void 0 : _a.code; }).join(";");
            hash = ethers.utils.keccak256(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(code)));
        }
        catch (err) {
            this.logger.debug(`Error in prestate tracer: ${err}`);
        }
        if (hash && codehash && codehash !== hash) {
            throw new RpcError("modified code after first validation", RpcErrorCodes.INVALID_OPCODE);
        }
        // if wallet is not created, trace simulateHandleOp to check that callData does not revert
        if (!this.config.testingMode && userOp.initCode.length > 2) {
            const simulateHandleOpTx = {
                to: entryPoint,
                data: entryPointContract.interface.encodeFunctionData("simulateHandleOp", [userOp, AddressZero, BytesZero]),
                gasLimit: simulationGas.mul(3),
                ...gasPrice,
            };
            const traceCall = await this.gethTracer.debug_traceCall(simulateHandleOpTx);
            for (const log of traceCall.logs) {
                if (log.topics[0] === EPv6UserOpEventHash) {
                    const data = entryPointContract.interface.decodeEventLog(log.topics[0], log.data);
                    if (!data.success) {
                        throw new RpcError("execution reverted", RpcErrorCodes.EXECUTION_REVERTED);
                    }
                }
            }
        }
        const storageMap = {};
        traceCall.callsFromEntryPoint.forEach((level) => {
            Object.keys(level.access).forEach((addr) => {
                var _a;
                storageMap[addr] = (_a = storageMap[addr]) !== null && _a !== void 0 ? _a : level.access[addr].reads;
            });
        });
        return {
            ...validationResult,
            referencedContracts: {
                addresses,
                hash,
            },
            storageMap,
        };
    }
    async validateOpcodesAndStake(traceCall, entryPointContract, userOp) {
        var _a;
        const entryPoint = entryPointContract.address.toLowerCase();
        if (traceCall == null || traceCall.callsFromEntryPoint == undefined) {
            throw new Error("Could not validate transaction. Tracing is not available");
        }
        if (Object.values(traceCall.callsFromEntryPoint).length < 1) {
            throw new RpcError("Unexpected traceCall result: no calls from entrypoint.", RpcErrorCodes.INTERNAL_ERROR);
        }
        const callStack = parseCallStack(traceCall);
        const callInfoEntryPoint = callStack.find((call) => call.to === entryPoint &&
            call.from !== entryPoint &&
            call.method !== "0x" &&
            call.method !== "depositTo");
        if (callInfoEntryPoint != null) {
            throw new RpcError(`illegal call into EntryPoint during validation ${callInfoEntryPoint === null || callInfoEntryPoint === void 0 ? void 0 : callInfoEntryPoint.method}`, RpcErrorCodes.INVALID_OPCODE);
        }
        if (callStack.some(({ to, value }) => to !== entryPoint && BigNumber.from(value !== null && value !== void 0 ? value : 0).gt(0))) {
            throw new RpcError("May not may CALL with value", RpcErrorCodes.INVALID_OPCODE);
        }
        const sender = userOp.sender.toLowerCase();
        // Parse error result from the last call
        const lastResult = traceCall.calls.at(-1);
        if (lastResult.type !== "REVERT") {
            throw new RpcError("Invalid response. simulateCall must revert", RpcErrorCodes.VALIDATION_FAILED);
        }
        const data = lastResult.data;
        const validationResult = parseValidationResult(entryPointContract, userOp, data);
        const stakeInfoEntities = {
            factory: validationResult.factoryInfo,
            account: validationResult.senderInfo,
            paymaster: validationResult.paymasterInfo,
        };
        const entitySlots = parseEntitySlots(stakeInfoEntities, traceCall.keccak);
        for (const [entityTitle, entStakes] of Object.entries(stakeInfoEntities)) {
            const entityAddr = ((entStakes === null || entStakes === void 0 ? void 0 : entStakes.addr) || "").toLowerCase();
            const currentNumLevel = traceCall.callsFromEntryPoint.find((info) => info.topLevelMethodSig === callsFromEntryPointMethodSigs[entityTitle]);
            if (currentNumLevel == null) {
                if (entityTitle === "account") {
                    throw new RpcError("missing trace into validateUserOp", RpcErrorCodes.EXECUTION_REVERTED);
                }
                continue;
            }
            const opcodes = currentNumLevel.opcodes;
            const access = currentNumLevel.access;
            if (currentNumLevel.oog) {
                throw new RpcError(`${entityTitle} internally reverts on oog`, RpcErrorCodes.INVALID_OPCODE);
            }
            const whitelist = this.networkConfig.whitelistedEntities[entityTitle];
            if (entityAddr &&
                whitelist != null &&
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                whitelist.some((addr) => ethers.utils.getAddress(addr) ===
                    ethers.utils.getAddress(entityAddr))) {
                this.logger.debug(`${entityTitle} is in whitelist. Skipping opcode validation...`);
                continue;
            }
            Object.keys(opcodes).forEach((opcode) => {
                if (bannedOpCodes.has(opcode)) {
                    throw new RpcError(`${entityTitle} uses banned opcode: ${opcode}`, RpcErrorCodes.INVALID_OPCODE);
                }
            });
            // Special case for CREATE2
            if (entityTitle === "factory") {
                if (opcodes.CREATE2 > 1) {
                    throw new RpcError(`${entityTitle} with too many CREATE2`, RpcErrorCodes.INVALID_OPCODE);
                }
            }
            else {
                if (opcodes.CREATE2 > 0) {
                    throw new RpcError(`${entityTitle} uses banned opcode: CREATE2`, RpcErrorCodes.INVALID_OPCODE);
                }
            }
            for (const [addr, { reads, writes }] of Object.entries(access)) {
                if (addr === sender) {
                    continue;
                }
                if (addr === entryPoint) {
                    continue;
                }
                // eslint-disable-next-line no-inner-declarations
                function nameAddr(addr, _currentEntity) {
                    var _a;
                    const [title] = (_a = Object.entries(stakeInfoEntities).find(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    ([title, info]) => (info === null || info === void 0 ? void 0 : info.addr.toLowerCase()) === addr.toLowerCase())) !== null && _a !== void 0 ? _a : [];
                    return title !== null && title !== void 0 ? title : addr;
                }
                let requireStakeSlot;
                for (const slot of [...Object.keys(writes), ...Object.keys(reads)]) {
                    if (isSlotAssociatedWith(slot, sender, entitySlots)) {
                        if (userOp.initCode.length > 2 &&
                            !(entityAddr === sender &&
                                (await this.reputationService.checkStake(stakeInfoEntities.factory)).code === 0)) {
                            requireStakeSlot = slot;
                        }
                    }
                    else if (isSlotAssociatedWith(slot, entityAddr, entitySlots)) {
                        requireStakeSlot = slot;
                    }
                    else if (addr === entityAddr) {
                        requireStakeSlot = slot;
                    }
                    else if (writes[slot] == null) {
                        requireStakeSlot = slot;
                    }
                    else {
                        const readWrite = Object.keys(writes).includes(addr)
                            ? "write to"
                            : "read from";
                        throw new RpcError(
                        // eslint-disable-next-line prettier/prettier
                        `${entityTitle} has forbidden ${readWrite} ${nameAddr(addr, entityTitle)} slot ${slot}`, RpcErrorCodes.INVALID_OPCODE, {
                            [entityTitle]: entStakes === null || entStakes === void 0 ? void 0 : entStakes.addr,
                        });
                    }
                }
                if (requireStakeSlot != null) {
                    const stake = await this.reputationService.checkStake(entStakes);
                    if (stake.code != 0) {
                        throw new RpcError(`unstaked ${entityTitle} accessed ${nameAddr(addr, entityTitle)} slot ${requireStakeSlot}`, RpcErrorCodes.INVALID_OPCODE, {
                            [entityTitle]: entStakes === null || entStakes === void 0 ? void 0 : entStakes.addr,
                        });
                    }
                }
            }
            if (entityTitle === "paymaster") {
                const validatePaymasterUserOp = callStack.find((call) => call.method === "validatePaymasterUserOp" && call.to === entityAddr);
                const context = (_a = validatePaymasterUserOp === null || validatePaymasterUserOp === void 0 ? void 0 : validatePaymasterUserOp.return) === null || _a === void 0 ? void 0 : _a.context;
                if (context != null && context !== "0x") {
                    const stake = await this.reputationService.checkStake(entStakes);
                    if (stake.code != 0) {
                        throw new RpcError("unstaked paymaster must not return context", RpcErrorCodes.INVALID_OPCODE, {
                            [entityTitle]: entStakes === null || entStakes === void 0 ? void 0 : entStakes.addr,
                        });
                    }
                }
            }
            for (const addr of Object.keys(currentNumLevel.contractSize)) {
                if (addr !== sender &&
                    currentNumLevel.contractSize[addr].contractSize <= 2) {
                    const { opcode } = currentNumLevel.contractSize[addr];
                    throw new RpcError(`${entityTitle} accesses un-deployed contract address ${addr} with opcode ${opcode}`, RpcErrorCodes.INVALID_OPCODE);
                }
            }
            for (const addr of Object.keys(currentNumLevel.extCodeAccessInfo)) {
                if (addr === entryPoint) {
                    throw new RpcError(`${entityTitle} accesses EntryPoint contract address ${addr} with opcode ${currentNumLevel.extCodeAccessInfo[addr]}`, RpcErrorCodes.INVALID_OPCODE);
                }
            }
        }
        return validationResult;
    }
}
//# sourceMappingURL=safe.js.map