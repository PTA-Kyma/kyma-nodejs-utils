import { C4CService } from '@pta-kyma/c4c-odata-access';
import * as express from 'express';
export declare function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<express.Response<any, Record<string, any>>>;
export declare function callC4CService(req: express.Request): void;
export interface C4CAuthSession {
    sessionId: string;
    username: string;
    csrf: string;
    sapToken: string;
    sapUrl: string;
}
declare global {
    namespace Express {
        interface Request {
            c4cService: C4CService;
            session: C4CAuthSession;
        }
    }
}
