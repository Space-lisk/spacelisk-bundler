import { BigNumber, ethers } from "ethers";
import { IEntryPoint__factory } from "../../../types/lib/executor/contracts/index.js";
import mantleSDK from "@mantleio/sdk";
export const estimateMantlePVG = (provider) => {
    const dummyWallet = ethers.Wallet.createRandom();
    return async (entryPointAddr, userOp, initial) => {
        const entryPoint = IEntryPoint__factory.connect(entryPointAddr, provider);
        const handleOpsData = entryPoint.interface.encodeFunctionData("handleOps", [
            [userOp],
            dummyWallet.address,
        ]);
        try {
            const mantleProvider = mantleSDK.asL2Provider(provider);
            const latestBlock = await provider.getBlock("latest");
            if (latestBlock.baseFeePerGas == null) {
                throw new Error("no base fee");
            }
            const l1GasCost = await mantleProvider.estimateL1GasCost({
                to: entryPointAddr,
                data: handleOpsData,
            });
            const l2MaxFee = BigNumber.from(userOp.maxFeePerGas);
            const l2PriorityFee = latestBlock.baseFeePerGas.add(userOp.maxPriorityFeePerGas);
            const l2Price = l2MaxFee.lt(l2PriorityFee) ? l2MaxFee : l2PriorityFee;
            return l1GasCost.div(l2Price).add(initial);
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.error("Error while estimating optimism PVG", err);
            return BigNumber.from(initial);
        }
    };
};
//# sourceMappingURL=mantle.js.map