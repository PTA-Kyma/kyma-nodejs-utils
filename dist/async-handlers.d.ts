import * as express from 'express';
export declare function handleGetWithFilesystemCache<T>(app: express.Application, path: string, func: (req: express.Request) => Promise<T>): void;
export declare function handleGet<T>(app: express.Application, path: string, func: (req: express.Request, res: express.Response) => Promise<T>): void;
export declare function handlePost<T>(app: express.Application, path: string, func: (req: express.Request, res: express.Response) => Promise<T>): void;
//# sourceMappingURL=async-handlers.d.ts.map