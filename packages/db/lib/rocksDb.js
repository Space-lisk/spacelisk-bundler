import path from "node:path";
import rocks from "@farcaster/rocksdb";
var Status;
(function (Status) {
    Status["started"] = "started";
    Status["stopped"] = "stopped";
})(Status || (Status = {}));
export class RocksDbController {
    constructor(dbDir, namespace) {
        this.status = Status.stopped;
        this.db = rocks(path.resolve(dbDir, namespace));
        this.namespace = namespace;
    }
    get(key) {
        key = `${this.namespace}:${key}`;
        return new Promise((resolve, reject) => {
            this.db.get(key, (err, value) => {
                if (err) {
                    return reject(err);
                }
                try {
                    resolve(JSON.parse(value));
                }
                catch (_) {
                    return resolve(value);
                }
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    put(key, value) {
        key = `${this.namespace}:${key}`;
        return new Promise((resolve, reject) => {
            this.db.put(key, JSON.stringify(value), (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    del(key) {
        key = `${this.namespace}:${key}`;
        return new Promise((resolve, reject) => {
            this.db.del(key, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    getMany(keys) {
        keys = keys.map((key) => `${this.namespace}:${key}`);
        return new Promise((resolve, reject) => {
            this.db.getMany(keys, (err, values) => {
                if (err) {
                    return reject(err);
                }
                try {
                    resolve(values.map((value) => JSON.parse(value)));
                }
                catch (_) {
                    return reject(values);
                }
            });
        });
    }
    async start() {
        if (this.status === Status.started)
            return;
        this.status = Status.started;
        this.db.open((err) => {
            if (err)
                throw Error("Unable to start database " + err);
        });
    }
    async stop() {
        if (this.status === Status.stopped)
            return;
        this.status = Status.stopped;
        this.db.close((err) => {
            if (err) {
                throw Error("Unable to stop database " + err);
            }
        });
    }
}
//# sourceMappingURL=rocksDb.js.map