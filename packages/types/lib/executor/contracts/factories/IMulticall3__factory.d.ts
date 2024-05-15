import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IMulticall3, IMulticall3Interface } from "../IMulticall3";
export declare class IMulticall3__factory {
    static readonly abi: {
        inputs: ({
            internalType: string;
            name: string;
            type: string;
            components?: undefined;
        } | {
            components: {
                internalType: string;
                name: string;
                type: string;
            }[];
            internalType: string;
            name: string;
            type: string;
        })[];
        name: string;
        outputs: ({
            internalType: string;
            name: string;
            type: string;
            components?: undefined;
        } | {
            components: {
                internalType: string;
                name: string;
                type: string;
            }[];
            internalType: string;
            name: string;
            type: string;
        })[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): IMulticall3Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): IMulticall3;
}
//# sourceMappingURL=IMulticall3__factory.d.ts.map