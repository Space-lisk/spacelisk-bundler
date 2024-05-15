import { GossipValidatorFn, GossipHandlers } from "../gossip/interface";
export type ValidatorFnModules = {};
/**
 * Returns a GossipSub validator function from a GossipHandlerFn. GossipHandlerFn may throw GossipActionError if one
 * or more validation conditions from the consensus-specs#p2p-interface are not satisfied.
 *
 * This function receives a string topic and a binary message `InMessage` and deserializes both using caches.
 * - The topic string should be known in advance and pre-computed
 * - The message.data should already by uncompressed when computing its msgID
 *
 * All logging and metrics associated with gossip object validation should happen in this function. We want to know
 * - In debug logs what objects are we processing, the result and some succint metadata
 * - In metrics what's the throughput and ratio of accept/ignore/reject per type
 *
 * @see getGossipHandlers for reasoning on why GossipHandlerFn are used for gossip validation.
 */
export declare function getGossipValidatorFn(gossipHandlers: GossipHandlers, _modules: ValidatorFnModules): GossipValidatorFn;
//# sourceMappingURL=gossipValidatorFn.d.ts.map