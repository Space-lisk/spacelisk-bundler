import { NodeInterface__factory } from "@arbitrum/sdk/dist/lib/abi/factories/NodeInterface__factory.js";
import { NODE_INTERFACE_ADDRESS } from "@arbitrum/sdk/dist/lib/dataEntities/constants.js";
import { BigNumber, ethers } from "ethers";
import { IEntryPoint__factory } from "../../../types/lib/executor/contracts/index.js";
export const estimateArbitrumPVG = (provider) => {
    const nodeInterface = NodeInterface__factory.connect(NODE_INTERFACE_ADDRESS, provider);
    const dummyWallet = ethers.Wallet.createRandom();
    return async (entryPointAddr, userOp, initial) => {
        const entryPoint = IEntryPoint__factory.connect(entryPointAddr, provider);
        const handleOpsData = entryPoint.interface.encodeFunctionData("handleOps", [
            [userOp],
            dummyWallet.address,
        ]);
        const contractCreation = BigNumber.from(userOp.nonce).eq(0);
        try {
            const gasEstimateComponents = await nodeInterface.callStatic.gasEstimateL1Component(entryPoint.address, contractCreation, handleOpsData);
            const l1GasEstimated = gasEstimateComponents.gasEstimateForL1;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const baseFee = gasEstimateComponents.baseFee;
            return l1GasEstimated.add(initial);
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.error("Error while estimating arbitrum PVG", err);
            return BigNumber.from(initial);
        }
    };
};
//# sourceMappingURL=arbitrum.js.map