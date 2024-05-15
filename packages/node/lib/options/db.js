import { homedir } from "node:os";
export const defaultDBOptions = {
    dbDir: `${homedir()}/.skandha/db/`,
    dbFile: "mempool-db",
    namespace: "userops",
};
//# sourceMappingURL=db.js.map