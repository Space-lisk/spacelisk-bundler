export var ReputationStatus;
(function (ReputationStatus) {
    ReputationStatus[ReputationStatus["OK"] = 0] = "OK";
    ReputationStatus[ReputationStatus["THROTTLED"] = 1] = "THROTTLED";
    ReputationStatus[ReputationStatus["BANNED"] = 2] = "BANNED";
})(ReputationStatus || (ReputationStatus = {}));
export * from "./validation/index.js";
export * from "./IWhitelistedEntities.js";
export * from "./entities/index.js";
//# sourceMappingURL=index.js.map