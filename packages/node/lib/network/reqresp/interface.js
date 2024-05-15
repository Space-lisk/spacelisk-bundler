//  Request/Response constants
export var RespStatus;
(function (RespStatus) {
    /**
     * A normal response follows, with contents matching the expected message schema and encoding specified in the request
     */
    RespStatus[RespStatus["SUCCESS"] = 0] = "SUCCESS";
    /**
     * The contents of the request are semantically invalid, or the payload is malformed,
     * or could not be understood. The response payload adheres to the ErrorMessage schema
     */
    RespStatus[RespStatus["INVALID_REQUEST"] = 1] = "INVALID_REQUEST";
    /**
     * The responder encountered an error while processing the request. The response payload adheres to the ErrorMessage schema
     */
    RespStatus[RespStatus["SERVER_ERROR"] = 2] = "SERVER_ERROR";
    /**
     * The responder does not have requested resource.  The response payload adheres to the ErrorMessage schema (described below). Note: This response code is only valid as a response to BlocksByRange
     */
    RespStatus[RespStatus["RESOURCE_UNAVAILABLE"] = 3] = "RESOURCE_UNAVAILABLE";
    /**
     * Our node does not have bandwidth to serve requests due to either per-peer quota or total quota.
     */
    RespStatus[RespStatus["RATE_LIMITED"] = 139] = "RATE_LIMITED";
})(RespStatus || (RespStatus = {}));
//# sourceMappingURL=interface.js.map