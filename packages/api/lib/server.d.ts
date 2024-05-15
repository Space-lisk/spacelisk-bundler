import { FastifyInstance } from "fastify";
import { ServerConfig } from "types/lib/api/interfaces";
export declare class Server {
    http: FastifyInstanceAny;
    ws: FastifyInstanceAny | null;
    private config;
    constructor(http: FastifyInstanceAny, ws: FastifyInstanceAny | null, config: ServerConfig);
    static init(config: ServerConfig): Promise<Server>;
    listen(): Promise<void>;
}
type FastifyInstanceAny = FastifyInstance<any, any, any, any, any>;
export {};
//# sourceMappingURL=server.d.ts.map