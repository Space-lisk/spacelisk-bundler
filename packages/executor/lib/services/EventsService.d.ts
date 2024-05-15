import { providers } from "ethers";
import { IDbController, Logger } from "types/lib";
import { AccountDeployedEvent, SignatureAggregatorChangedEvent, UserOperationEventEvent } from "types/lib/executor/contracts/EntryPoint";
import { TypedEvent, TypedListener } from "types/lib/executor/contracts/common";
import { ReputationService } from "./ReputationService";
import { MempoolService } from "./MempoolService";
import { ExecutorEventBus } from "./SubscriptionService";
/**
 * Listens for events in the blockchain
 */
export declare class EventsService {
    private chainId;
    private provider;
    private logger;
    private reputationService;
    private mempoolService;
    private eventBus;
    private entryPointAddrs;
    private db;
    private entryPoints;
    private lastBlockPerEntryPoint;
    private LAST_BLOCK_KEY;
    constructor(chainId: number, provider: providers.JsonRpcProvider, logger: Logger, reputationService: ReputationService, mempoolService: MempoolService, eventBus: ExecutorEventBus, entryPointAddrs: string[], db: IDbController);
    initEventListener(): void;
    onUserOperationEvent(callback: TypedListener<UserOperationEventEvent>): void;
    offUserOperationEvent(callback: TypedListener<UserOperationEventEvent>): void;
    /**
     * manually handle all new events since last run
     */
    handlePastEvents(): Promise<void>;
    handleEvent(ev: ParsedEventType): Promise<void>;
    handleAggregatorChangedEvent(ev: SignatureAggregatorChangedEvent): Promise<void>;
    eventAggregator: string | null;
    eventAggregatorTxHash: string | null;
    getEventAggregator(ev: TypedEvent): string | null;
    handleAccountDeployedEvent(ev: AccountDeployedEvent): Promise<void>;
    handleUserOperationEvent(ev: UserOperationEventEvent): Promise<void>;
    private includedAddress;
    private saveLastBlockPerEntryPoints;
    private fetchLastBlockPerEntryPoints;
}
type ParsedEventType = UserOperationEventEvent | AccountDeployedEvent | SignatureAggregatorChangedEvent;
export {};
//# sourceMappingURL=EventsService.d.ts.map