export default class ApplicationError extends Error {
    constructor(message, status) {
        super();
        this.message = "ApplicationError";
        this.status = 500;
        if (message != null) {
            this.message = message;
        }
        if (status != null) {
            this.status = status;
        }
    }
}
//# sourceMappingURL=application-error.js.map