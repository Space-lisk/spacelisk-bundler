import { UserOperationStruct } from "types/lib/executor/contracts/EntryPoint";
import { MempoolEntry } from "../../entities/MempoolEntry";
import { NetworkConfig, StakeInfo } from "../../interfaces";
import { ReputationService } from "../ReputationService";
import { MempoolService } from "./service";
export declare class MempoolReputationChecks {
    private service;
    private reputationService;
    private networkConfig;
    constructor(service: MempoolService, reputationService: ReputationService, networkConfig: NetworkConfig);
    checkEntityCountInMempool(entry: MempoolEntry, accountInfo: StakeInfo, factoryInfo: StakeInfo | undefined, paymasterInfo: StakeInfo | undefined, aggregatorInfo: StakeInfo | undefined): Promise<void>;
    checkMultipleRolesViolation(entry: MempoolEntry): Promise<void>;
    updateSeenStatus(userOp: UserOperationStruct, aggregator?: string): Promise<void>;
    /**
     * returns a list of addresses of all entities in the mempool
     */
    private getKnownEntities;
}
//# sourceMappingURL=reputation.d.ts.map