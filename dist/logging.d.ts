import * as express from 'express';
import winston, { Logger } from 'winston';
export declare const logger: winston.Logger;
export declare function requestSpecificLoggerMiddleware(logStartAndEnd?: boolean): express.RequestHandler;
declare global {
    namespace Express {
        interface Request {
            logger: Logger;
        }
    }
}
export declare function logMaybeAxiosError(logger: winston.Logger, err: Error): void;
//# sourceMappingURL=logging.d.ts.map