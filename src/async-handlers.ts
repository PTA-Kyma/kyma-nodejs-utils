import * as express from 'express';
import { logMaybeAxiosError } from './logging';
import { promises } from 'fs';
import bodyParser from 'body-parser';

export function handleGetWithFilesystemCache<T>(
    app: express.Application,
    path: string,
    func: (req: express.Request) => Promise<T>
) {
    app.get(path, async (req, res) => {
        const cacheFilePath = './tmp/' + req.url.replace(/\//g, '_') + '.json';

        try {
            const result = JSON.parse(await promises.readFile(cacheFilePath, 'utf-8'));
            req.logger.debug('Data from cache');
            return res.send(result);
        } catch {
            req.logger.debug('Failed to get from cache');
        }

        try {
            const result = await func(req);
            await promises.writeFile(cacheFilePath, JSON.stringify(result, null, '\t'), 'utf-8');
            res.send(result);
        } catch (err) {
            logMaybeAxiosError(req.logger, err);
            res.status(500).send('Failed to process');
        }
    });
}

export function handleGet<T>(app: express.Application, path: string, func: (req: express.Request, res: express.Response) => Promise<T>) {
    app.get(path, async (req, res) => {
        try {
            const result = await func(req, res);
            res.send(result);
        } catch (err) {
            logMaybeAxiosError(req.logger, err);
            res.status(500).send('Failed to process');
        }
    });
}

export function handlePost<T>(app: express.Application, path: string, func: (req: express.Request, res: express.Response) => Promise<T>) {
    app.post(path, bodyParser.json(), async (req, res) => {
        try {
            const result = await func(req, res);
            res.send(result);
        } catch (err) {
            logMaybeAxiosError(req.logger, err);
            res.status(500).send('Failed to process');
        }
    });
}
