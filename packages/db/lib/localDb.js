var Status;
(function (Status) {
    Status["started"] = "started";
    Status["stopped"] = "stopped";
})(Status || (Status = {}));
export class LocalDbController {
    constructor(namespace) {
        this.status = Status.stopped;
        this.db = {};
        this.namespace = namespace;
    }
    async get(key) {
        key = `${this.namespace}:${key}`;
        const value = this.db[key];
        if (!value) {
            throw new Error("Not Found");
        }
        try {
            return JSON.parse(value);
        }
        catch (_) {
            return value;
        }
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    async put(key, value) {
        key = `${this.namespace}:${key}`;
        this.db[key] = JSON.stringify(value);
    }
    async del(key) {
        key = `${this.namespace}:${key}`;
        delete this.db[key];
    }
    async getMany(keys) {
        return keys.map((key) => {
            key = `${this.namespace}:${key}`;
            const value = this.db[key];
            if (!value) {
                throw new Error("Not Found");
            }
            try {
                return JSON.parse(value);
            }
            catch (_) {
                return value;
            }
        });
    }
    async start() {
        if (this.status === Status.started)
            return;
        this.status = Status.started;
    }
    async stop() {
        if (this.status === Status.stopped)
            return;
        this.status = Status.stopped;
    }
}
//# sourceMappingURL=localDb.js.map