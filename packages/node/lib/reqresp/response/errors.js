import { SkandhaError } from "utils/lib/index.js";
import { RespStatus } from "../interface.js";
export var ResponseErrorCode;
(function (ResponseErrorCode) {
    ResponseErrorCode["RESPONSE_STATUS_ERROR"] = "RESPONSE_STATUS_ERROR";
})(ResponseErrorCode || (ResponseErrorCode = {}));
/**
 * Used internally only to signal a response status error. Since the error should never bubble up to the user,
 * the error code and error message does not matter much.
 */
export class ResponseError extends SkandhaError {
    constructor(status, errorMessage) {
        const type = {
            code: ResponseErrorCode.RESPONSE_STATUS_ERROR,
            status,
            errorMessage,
        };
        super(type, `RESPONSE_ERROR_${RespStatus[status]}: ${errorMessage}`);
        this.status = status;
        this.errorMessage = errorMessage;
    }
}
//# sourceMappingURL=errors.js.map