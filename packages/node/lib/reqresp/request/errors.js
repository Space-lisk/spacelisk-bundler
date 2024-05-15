import { SkandhaError } from "utils/lib/index.js";
import { RespStatus } from "../interface.js";
export var RequestErrorCode;
(function (RequestErrorCode) {
    // Declaring specific values of RpcResponseStatusError for error clarity downstream
    /** `<response_chunk>` had `<result>` === INVALID_REQUEST */
    RequestErrorCode["INVALID_REQUEST"] = "REQUEST_ERROR_INVALID_REQUEST";
    /** `<response_chunk>` had `<result>` === SERVER_ERROR */
    RequestErrorCode["SERVER_ERROR"] = "REQUEST_ERROR_SERVER_ERROR";
    /** `<response_chunk>` had `<result>` === RESOURCE_UNAVAILABLE */
    RequestErrorCode["RESOURCE_UNAVAILABLE"] = "RESOURCE_UNAVAILABLE_ERROR";
    /** `<response_chunk>` had a `<result>` not known in the current spec */
    RequestErrorCode["UNKNOWN_ERROR_STATUS"] = "REQUEST_ERROR_UNKNOWN_ERROR_STATUS";
    /** Could not open a stream with peer before DIAL_TIMEOUT */
    RequestErrorCode["DIAL_TIMEOUT"] = "REQUEST_ERROR_DIAL_TIMEOUT";
    /** Error opening a stream with peer */
    RequestErrorCode["DIAL_ERROR"] = "REQUEST_ERROR_DIAL_ERROR";
    /** Reponder did not close write stream before REQUEST_TIMEOUT */
    RequestErrorCode["REQUEST_TIMEOUT"] = "REQUEST_ERROR_REQUEST_TIMEOUT";
    /** Error when sending request to responder */
    RequestErrorCode["REQUEST_ERROR"] = "REQUEST_ERROR_REQUEST_ERROR";
    /** Reponder did not deliver a full response before max maxTotalResponseTimeout() */
    RequestErrorCode["RESPONSE_TIMEOUT"] = "REQUEST_ERROR_RESPONSE_TIMEOUT";
    /** A single-response method returned 0 chunks */
    RequestErrorCode["EMPTY_RESPONSE"] = "REQUEST_ERROR_EMPTY_RESPONSE";
    /** Time to first byte timeout */
    RequestErrorCode["TTFB_TIMEOUT"] = "REQUEST_ERROR_TTFB_TIMEOUT";
    /** Timeout between `<response_chunk>` exceed */
    RequestErrorCode["RESP_TIMEOUT"] = "REQUEST_ERROR_RESP_TIMEOUT";
    /** Request rate limited */
    RequestErrorCode["REQUEST_RATE_LIMITED"] = "REQUEST_ERROR_RATE_LIMITED";
})(RequestErrorCode || (RequestErrorCode = {}));
/**
 * Same error types as RequestError but without metadata.
 * Top level function sendRequest() must rethrow RequestInternalError with metadata
 */
export class RequestInternalError extends SkandhaError {
    constructor(type) {
        super(type);
    }
}
export class RequestError extends SkandhaError {
    constructor(type, metadata) {
        super({ ...metadata, ...type }, renderErrorMessage(type));
    }
}
/**
 * Parse response status errors into detailed request errors for each status code for easier debugging
 */
export function responseStatusErrorToRequestError(e) {
    const { errorMessage, status } = e;
    switch (status) {
        case RespStatus.INVALID_REQUEST:
            return { code: RequestErrorCode.INVALID_REQUEST, errorMessage };
        case RespStatus.SERVER_ERROR:
            return { code: RequestErrorCode.SERVER_ERROR, errorMessage };
        case RespStatus.RESOURCE_UNAVAILABLE:
            return { code: RequestErrorCode.RESOURCE_UNAVAILABLE, errorMessage };
        default:
            return {
                code: RequestErrorCode.UNKNOWN_ERROR_STATUS,
                errorMessage,
                status,
            };
    }
}
/**
 * Render responder's errorMessage directly in main's error.message for easier debugging
 */
function renderErrorMessage(type) {
    switch (type.code) {
        case RequestErrorCode.INVALID_REQUEST:
        case RequestErrorCode.SERVER_ERROR:
        case RequestErrorCode.RESOURCE_UNAVAILABLE:
        case RequestErrorCode.UNKNOWN_ERROR_STATUS:
            return `${type.code}: ${type.errorMessage}`;
        default:
            return type.code;
    }
}
//# sourceMappingURL=errors.js.map