import { ReputationStatus } from "types/lib/executor";
export declare class SetReputationEntry {
    address: string;
    opsSeen: number;
    opsIncluded: number;
}
export declare class SetReputationArgs {
    reputations: SetReputationEntry[];
    entryPoint: string;
}
export type SetReputationResponse = Array<{
    address: string;
    opsSeen: number;
    opsIncluded: number;
    status: ReputationStatus;
}>;
//# sourceMappingURL=SetReputation.dto.d.ts.map