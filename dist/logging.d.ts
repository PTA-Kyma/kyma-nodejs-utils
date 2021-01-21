import * as express from 'express';
import winston, { Logger } from 'winston';
export declare function requestSpecificLoggerMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): void;
declare global {
    namespace Express {
        interface Request {
            logger: Logger;
        }
    }
}
export declare function logMaybeAxiosError(logger: winston.Logger, err: Error): void;
//# sourceMappingURL=logging.d.ts.map