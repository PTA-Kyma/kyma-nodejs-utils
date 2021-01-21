import { AxiosError } from 'axios';
import * as express from 'express';
import onFinished from 'on-finished';
import winston, { createLogger, format, Logger } from 'winston';

const { combine, timestamp, colorize } = format;

const transports: winston.transport[] = [];
if (process.env.NODE_ENV === 'production') {
    transports.push(
        new winston.transports.Console({
            format: combine(
                format.printf(i => {
                    if (i.requestId) {
                        return `${i.level} [${i.requestId}] ${i.message}`;
                    } else {
                        return `${i.level} ${i.message}`;
                    }
                })
            ),
        })
    );
} else {
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                format.printf(i => {
                    if (i.requestId) {
                        return `${i.timestamp} ${i.level} [${i.requestId}] ${i.message}`;
                    } else {
                        return `${i.timestamp} ${i.level} ${i.message}`;
                    }
                })
            ),
        })
    );
}

export const logger = createLogger({
    level: 'debug',
    transports,
});

let nextRequestId = 1;

export function requestSpecificLoggerMiddleware(logStartAndEnd: boolean = true): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.logger = logger.child({ requestId: nextRequestId });
        let requestInfo: string;
        if (logStartAndEnd) {
            requestInfo = `${req.method} ${req.url}`;
            req.logger.debug(`Request ${requestInfo} starting`);
        }
        nextRequestId++;
        next();

        if (logStartAndEnd) {
            onFinished(res, (err, msg) => {
                if (err) {
                    req.logger.error(`Request ${requestInfo} ended with error: ${err.name} ${err.message} `);
                }

                req.logger.debug(`End of request ${requestInfo}: ${msg.statusCode} ${msg.statusMessage}`);
            });
        }
    };
}

declare global {
    namespace Express {
        interface Request {
            logger: Logger;
        }
    }
}

export function logMaybeAxiosError(logger: winston.Logger, err: Error) {
    if (!logger) return;

    const axiosError = err as AxiosError<any>;
    if (axiosError.isAxiosError) {
        logger.error(axiosError.message);
        logger.error(axiosError.toJSON());
    } else {
        logger.error(err.message);
    }
}
