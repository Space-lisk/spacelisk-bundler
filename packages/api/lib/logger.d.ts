declare const logger: import("pino").Logger<{
    enabled: boolean;
    level: string;
    transport: {
        target: string;
        options: {
            colorize: boolean;
        };
    };
    serializers: {
        res: () => null;
        req: (req: any) => {
            method: any;
            url: any;
            path: any;
            body: any;
        };
    };
}>;
export type Logger = typeof logger;
export default logger;
//# sourceMappingURL=logger.d.ts.map