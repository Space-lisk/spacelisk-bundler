import fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import RpcError from "../../types/lib/api/errors/rpc-error.js";
import logger from "./logger.js";
import { HttpStatus } from "./constants.js";
export class Server {
    constructor(http, ws, config) {
        this.http = http;
        this.ws = ws;
        this.config = config;
    }
    static async init(config) {
        let ws = null;
        const app = fastify({
            logger,
            disableRequestLogging: !config.enableRequestLogging,
            ignoreTrailingSlash: true,
        });
        await app.register(cors, {
            origin: config.cors,
        });
        if (config.ws) {
            if (config.wsPort == config.port) {
                await app.register(websocket);
                ws = app;
            }
            else {
                ws = fastify({
                    logger,
                    disableRequestLogging: !config.enableRequestLogging,
                    ignoreTrailingSlash: true,
                });
            }
        }
        app.addHook("preHandler", (req, reply, done) => {
            if (req.method === "POST") {
                req.log.info({
                    method: req.method,
                    url: req.url,
                    body: req.body,
                }, "REQUEST ::");
            }
            else {
                req.log.info({
                    method: req.method,
                    url: req.url,
                }, "REQUEST ::");
            }
            done();
        });
        // RESPONSE LOG
        app.addHook("preSerialization", (request, reply, payload, done) => {
            if (payload) {
                request.log.info({ body: payload }, "RESPONSE ::");
            }
            done();
        });
        return new Server(app, ws, config);
    }
    async listen() {
        var _a, _b;
        const errorHandler = (err, req, res) => {
            var _a;
            // eslint-disable-next-line no-console
            logger.error(err);
            if (err instanceof RpcError) {
                const body = req.body;
                const error = {
                    message: err.message,
                    data: err.data,
                    code: err.code,
                };
                return res.status(HttpStatus.OK).send({
                    jsonrpc: body.jsonrpc,
                    id: body.id,
                    error,
                });
            }
            return res
                .status((_a = err.statusCode) !== null && _a !== void 0 ? _a : HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                error: "Unexpected behaviour",
            });
        };
        this.http.setErrorHandler(errorHandler);
        this.http.listen({
            port: this.config.port,
            host: this.config.host,
            listenTextResolver: (address) => `HTTP server listening at ${address}/rpc`,
        }, (err) => {
            if (err)
                throw err;
            if (this.http.websocketServer != null) {
                this.http.log.info(`Websocket server listening at ws://${this.config.host}:${this.config.port}/rpc`);
            }
        });
        if (this.config.ws && this.config.wsPort != this.config.port) {
            (_a = this.ws) === null || _a === void 0 ? void 0 : _a.setErrorHandler(errorHandler);
            (_b = this.ws) === null || _b === void 0 ? void 0 : _b.listen({
                port: this.config.wsPort,
                host: this.config.host,
                listenTextResolver: () => `Websocket server listening at ws://${this.config.host}:${this.config.wsPort}/rpc`,
            }, (err) => {
                if (err)
                    throw err;
            });
        }
    }
}
//# sourceMappingURL=server.js.map