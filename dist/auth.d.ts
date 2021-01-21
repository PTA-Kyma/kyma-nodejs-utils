import * as express from 'express';
export declare function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<express.Response<any, Record<string, any>>>;
export interface C4CAuthSession {
    sessionId: string;
    username: string;
    csrf: string;
    sapToken: string;
    sapUrl: string;
}
//# sourceMappingURL=auth.d.ts.map