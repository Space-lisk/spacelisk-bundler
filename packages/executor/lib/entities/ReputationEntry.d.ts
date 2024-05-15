import { ReputationStatus } from "types/lib/executor";
import { IReputationEntry, ReputationEntrySerialized } from "./interfaces";
export declare class ReputationEntry implements IReputationEntry {
    chainId: number;
    address: string;
    lastUpdateTime: number;
    private _opsSeen;
    private _opsIncluded;
    constructor({ chainId, address, opsSeen, opsIncluded, lastUpdateTime, }: {
        chainId: number;
        address: string;
        opsSeen?: number;
        opsIncluded?: number;
        lastUpdateTime?: number;
    });
    get opsSeen(): number;
    get opsIncluded(): number;
    isBanned(minInclusionDenominator: number, banSlack: number): boolean;
    isThrottled(minInclusionDenominator: number, throttlingSlack: number): boolean;
    getStatus(minInclusionDenominator: number, throttlingSlack: number, banSlack: number): ReputationStatus;
    addToReputation(opsSeen: number, opsIncluded: number): void;
    setReputation(opsSeen: number, opsIncluded: number): void;
    serialize(): ReputationEntrySerialized;
}
//# sourceMappingURL=ReputationEntry.d.ts.map