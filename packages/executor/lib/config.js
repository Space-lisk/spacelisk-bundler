// TODO: create a new package "config" instead of this file and refactor
import { BigNumber, Wallet, providers, utils } from "ethers";
import { getAddress } from "ethers/lib/utils.js";
export class Config {
    constructor(options) {
        var _a, _b, _c;
        this.testingMode = (_a = options.testingMode) !== null && _a !== void 0 ? _a : false;
        this.unsafeMode = (_b = options.unsafeMode) !== null && _b !== void 0 ? _b : false;
        this.redirectRpc = (_c = options.redirectRpc) !== null && _c !== void 0 ? _c : false;
        this.config = this.getDefaultNetworkConfig(options.config);
        this.chainId = 0;
    }
    static async init(configOptions) {
        const config = new Config(configOptions);
        try {
            await config.fetchChainId();
        }
        catch (err) {
            // trying again with skipping ssl errors
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
            await config.fetchChainId();
        }
        return config;
    }
    getNetworkProvider() {
        return new providers.JsonRpcProvider(this.config.rpcEndpoint);
    }
    getRelayers() {
        const provider = this.getNetworkProvider();
        if (this.testingMode) {
            return [provider.getSigner()];
        }
        const wallets = [];
        for (const privKey of this.config.relayers) {
            if (privKey.startsWith("0x")) {
                wallets.push(new Wallet(privKey, provider));
            }
            else {
                wallets.push(Wallet.fromMnemonic(privKey).connect(provider));
            }
        }
        return wallets;
    }
    getBeneficiary() {
        return this.config.beneficiary;
    }
    getNetworkConfig() {
        return this.config;
    }
    getCanonicalMempool() {
        return {
            entryPoint: this.config.canonicalEntryPoint,
            mempoolId: this.config.canonicalMempoolId,
        };
    }
    async fetchChainId() {
        const provider = this.getNetworkProvider();
        try {
            const network = await provider.getNetwork();
            this.chainId = network.chainId;
        }
        catch (err) {
            throw new Error("Could not fetch chain id");
        }
    }
    isEntryPointSupported(entryPoint) {
        return !!this.config.entryPoints.some((addr) => addr.toLowerCase() === entryPoint.toLowerCase());
    }
    getDefaultNetworkConfig(config) {
        var _a;
        if (config == null)
            config = {};
        config.entryPoints = fromEnvVar("ENTRYPOINTS", config.entryPoints, true);
        config.relayers = fromEnvVar("RELAYERS", config.relayers, true);
        config.beneficiary = fromEnvVar("BENEFICIARY", config.beneficiary || bundlerDefaultConfigs.beneficiary);
        config.rpcEndpoint = fromEnvVar("RPC", config.rpcEndpoint);
        if (this.testingMode && !config.rpcEndpoint) {
            config.rpcEndpoint = "http://localhost:8545"; // local geth
        }
        config.etherscanApiKey = fromEnvVar("ETHERSCAN_API_KEY", config.etherscanApiKey || bundlerDefaultConfigs.etherscanApiKey);
        config.receiptLookupRange = Number(fromEnvVar("RECEIPT_LOOKUP_RANGE", config.receiptLookupRange || bundlerDefaultConfigs.receiptLookupRange));
        config.conditionalTransactions = Boolean(fromEnvVar("CONDITIONAL_TRANSACTIONS", config.conditionalTransactions ||
            bundlerDefaultConfigs.conditionalTransactions));
        config.rpcEndpointSubmit = fromEnvVar("RPC_SUBMIT", config.rpcEndpointSubmit || bundlerDefaultConfigs.rpcEndpointSubmit);
        config.gasPriceMarkup = Number(fromEnvVar("GAS_PRICE_MARKUP", config.gasPriceMarkup || bundlerDefaultConfigs.gasPriceMarkup));
        config.enforceGasPrice = Boolean(fromEnvVar("ENFORCE_GAS_PRICE", config.enforceGasPrice || bundlerDefaultConfigs.enforceGasPrice));
        config.enforceGasPriceThreshold = Number(fromEnvVar("ENFORCE_GAS_PRICE_THRESHOLD", config.enforceGasPriceThreshold ||
            bundlerDefaultConfigs.enforceGasPriceThreshold));
        config.eip2930 = Boolean(fromEnvVar("EIP2930", config.eip2930 || bundlerDefaultConfigs.eip2930));
        config.useropsTTL = Number(fromEnvVar("USEROPS_TTL", config.useropsTTL || bundlerDefaultConfigs.useropsTTL));
        config.minStake = BigNumber.from(fromEnvVar("MIN_STAKE", (_a = config.minStake) !== null && _a !== void 0 ? _a : bundlerDefaultConfigs.minStake));
        config.minUnstakeDelay = Number(fromEnvVar("MIN_UNSTAKE_DELAY", config.minUnstakeDelay || bundlerDefaultConfigs.minUnstakeDelay));
        config.bundleGasLimitMarkup = Number(fromEnvVar("BUNDLE_GAS_LIMIT_MARKUP", config.bundleGasLimitMarkup ||
            bundlerDefaultConfigs.bundleGasLimitMarkup));
        config.relayingMode = fromEnvVar("RELAYING_MODE", config.relayingMode || bundlerDefaultConfigs.relayingMode);
        config.bundleInterval = Number(fromEnvVar("BUNDLE_INTERVAL", config.bundleInterval || bundlerDefaultConfigs.bundleInterval));
        config.bundleSize = Number(fromEnvVar("BUNDLE_SIZE", config.bundleSize || bundlerDefaultConfigs.bundleSize));
        config.pvgMarkup = Number(fromEnvVar("PVG_MARKUP", config.pvgMarkup || bundlerDefaultConfigs.pvgMarkup));
        config.canonicalMempoolId = String(fromEnvVar("CANONICAL_MEMPOOL", config.canonicalMempoolId || bundlerDefaultConfigs.canonicalMempoolId));
        config.canonicalEntryPoint = String(fromEnvVar("CANONICAL_ENTRY_POINT", config.canonicalEntryPoint || bundlerDefaultConfigs.canonicalEntryPoint));
        config.cglMarkup = Number(fromEnvVar("CGL_MARKUP", config.cglMarkup || bundlerDefaultConfigs.cglMarkup));
        config.vglMarkup = Number(fromEnvVar("VGL_MARKUP", config.vglMarkup || bundlerDefaultConfigs.vglMarkup));
        config.gasFeeInSimulation = Boolean(fromEnvVar("GAS_FEE_IN_SIMULATION", config.gasFeeInSimulation || bundlerDefaultConfigs.gasFeeInSimulation));
        config.throttlingSlack = Number(fromEnvVar("THROTTLING_SLACK", config.throttlingSlack || bundlerDefaultConfigs.throttlingSlack));
        config.banSlack = Number(fromEnvVar("BAN_SLACK", config.banSlack || bundlerDefaultConfigs.banSlack));
        config.minInclusionDenominator = Number(fromEnvVar("MIN_INCLUSION_DENOMINATOR", config.minInclusionDenominator ||
            bundlerDefaultConfigs.minInclusionDenominator));
        config.merkleApiURL = String(fromEnvVar("MERKLE_API_URL", config.merkleApiURL || bundlerDefaultConfigs.merkleApiURL));
        config.skipBundleValidation = Boolean(fromEnvVar("SKIP_BUNDLE_VALIDATION", config.skipBundleValidation ||
            bundlerDefaultConfigs.skipBundleValidation));
        config.bundleGasLimit = Number(fromEnvVar("BUNDLE_GAS_LIMIT", config.bundleGasLimit || bundlerDefaultConfigs.bundleGasLimit));
        config.userOpGasLimit = Number(fromEnvVar("USEROP_GAS_LIMIT", config.userOpGasLimit || bundlerDefaultConfigs.userOpGasLimit));
        config.kolibriAuthKey = String(fromEnvVar("KOLIBRI_AUTH_KEY", config.kolibriAuthKey || bundlerDefaultConfigs.kolibriAuthKey));
        config.entryPointForwarder = String(fromEnvVar("ENTRYPOINT_FORWARDER", config.entryPointForwarder || bundlerDefaultConfigs.entryPointForwarder));
        config.fastlaneValidators = fromEnvVar("FASTLANE_VALIDATOR", config.fastlaneValidators || bundlerDefaultConfigs.fastlaneValidators, true);
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!config.whitelistedEntities) {
            config.whitelistedEntities = bundlerDefaultConfigs.whitelistedEntities;
        }
        /**
         * validate whitelist addresses
         */
        for (const entity of ["paymaster", "account", "factory"]) {
            config.whitelistedEntities[entity] = fromEnvVar(`WL_${entity.toUpperCase()}`, config.whitelistedEntities[entity], true);
            const entities = config.whitelistedEntities[entity];
            if (typeof entities != "undefined" && typeof entities != "object") {
                throw new Error("Invalid config");
            }
            if (typeof entities == "object") {
                for (const address of entities) {
                    // will throw error if the address is invalid
                    getAddress(address);
                }
            }
        }
        return Object.assign({}, bundlerDefaultConfigs, config);
    }
}
const bundlerDefaultConfigs = {
    beneficiary: "",
    minInclusionDenominator: 10,
    throttlingSlack: 10,
    banSlack: 50,
    minStake: utils.parseEther("0.01"),
    minUnstakeDelay: 0,
    minSignerBalance: utils.parseEther("0.1"),
    multicall: "0xcA11bde05977b3631167028862bE2a173976CA11", // default multicall address
    validationGasLimit: 10e6,
    receiptLookupRange: 1024,
    etherscanApiKey: "",
    conditionalTransactions: false,
    rpcEndpointSubmit: "",
    gasPriceMarkup: 0,
    enforceGasPrice: false,
    enforceGasPriceThreshold: 1000,
    eip2930: false,
    useropsTTL: 300, // 5 minutes
    whitelistedEntities: { paymaster: [], account: [], factory: [] },
    bundleGasLimitMarkup: 25000,
    bundleInterval: 10000, // 10 seconds
    bundleSize: 4, // max size of bundle (in terms of user ops)
    relayingMode: "classic",
    pvgMarkup: 0,
    canonicalMempoolId: "",
    canonicalEntryPoint: "",
    cglMarkup: 35000,
    vglMarkup: 0,
    gasFeeInSimulation: false,
    merkleApiURL: "https://pool.merkle.io",
    skipBundleValidation: false,
    userOpGasLimit: 25000000,
    bundleGasLimit: 25000000,
    kolibriAuthKey: "",
    entryPointForwarder: "",
    echoAuthKey: "",
    archiveDuration: 24 * 3600,
    fastlaneValidators: [],
};
function getEnvVar(envVar, fallback) {
    const env = process.env[envVar];
    if (!env)
        return fallback;
    return env;
}
function fromEnvVar(envVar = "", fallback, isArray = false) {
    const envVarName = `SKANDHA_${envVar}`;
    const envVarOrFallback = getEnvVar(envVarName, fallback);
    if (isArray && typeof envVarOrFallback === "string") {
        return envVarOrFallback
            .toLowerCase()
            .replace(/ /g, "")
            .split(",");
    }
    return envVarOrFallback;
}
//# sourceMappingURL=config.js.map