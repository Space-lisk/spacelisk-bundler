import ApplicationError from "./application-error.js";
export default class BadRequest extends ApplicationError {
    constructor(message) {
        super(message || "Bad request", 400);
    }
}
//# sourceMappingURL=bad-request.js.map