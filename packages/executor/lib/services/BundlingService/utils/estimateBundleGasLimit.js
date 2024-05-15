import { BigNumber } from "ethers";
export function estimateBundleGasLimit(markup, bundle) {
    let gasLimit = BigNumber.from(markup);
    for (const { userOp } of bundle) {
        gasLimit = getUserOpGasLimit(userOp, gasLimit);
    }
    if (gasLimit.lt(1e5)) {
        // gasLimit should at least be 1e5 to pass test in test-executor
        gasLimit = BigNumber.from(1e5);
    }
    return gasLimit;
}
export function getUserOpGasLimit(userOp, markup = BigNumber.from(0)) {
    return BigNumber.from(userOp.verificationGasLimit)
        .mul(3)
        .add(userOp.preVerificationGas)
        .add(userOp.callGasLimit)
        .mul(11)
        .div(10)
        .add(markup);
}
//# sourceMappingURL=estimateBundleGasLimit.js.map