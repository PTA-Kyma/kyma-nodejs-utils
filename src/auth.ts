import * as express from 'express';
import Axios from 'axios';
import { C4CService } from '@pta-kyma/c4c-odata-access';
import * as uuid from 'uuid';
import { logMaybeAxiosError } from './logging';
import { Session } from 'inspector';

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL;
if (!AUTH_SERVER_URL) {
    throw new Error('No AUTH_SERVER_URL!');
}

const authClient = Axios.create({
    baseURL: AUTH_SERVER_URL,
    headers: {
        'Content-Type': 'text/plain',
    },
});

const sessions: { [sessionId: string]: C4CAuthSession } = {};

export async function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    // ensure we only got one session id or not at all
    const sessionIdHeader = req.headers['x-session'];

    if (sessionIdHeader && typeof sessionIdHeader !== 'string') {
        return res.status(403).send('Bad format of X-Session');
    }

    const sessionId: string | undefined = sessionIdHeader as string;

    let session: C4CAuthSession = sessionId && typeof sessionId === 'string' && sessions[sessionId];

    if (req.path === '/login') {
        // code is expected to be in the header of x-code

        const code = req.headers['x-code'];

        if (code) {
            req.logger?.debug(`Authenticating against server with code ${code}...`);
            try {
                session = (await authClient.post<C4CAuthSession>('/token', code)).data;

                // ok, good, save that session and return to user
                sessions[session.sessionId] = session;
                return res.status(200).send({
                    sessionId: session.sessionId,
                    username: session.username,
                    sapUrl: session.sapUrl,
                });
            } catch (err) {
                logMaybeAxiosError(req.logger, err);
                return res.status(500).send('Failed to verify code');
            }
        } else if (sessionId) {
            req.logger?.debug('Authenticating with sessionId...');
            try {
                session = (await authClient.post<C4CAuthSession>('/session', sessionId)).data;

                // sessionId is indeed correct, so add session to our cache
                sessions[sessionId] = session;
                return res.status(200).send({
                    sessionId: session.sessionId,
                    username: session.username,
                    sapUrl: session.sapUrl,
                });
            } catch (err) {
                logMaybeAxiosError(req.logger, err);
                // fail
            }
        } else {
            req.logger?.debug('Called login with neither x-session nor x-code...');
            return res.status(403).send('Please provide either an x-code or x-session header');
        }
    }

    if (!session) {
        return res.status(403).send(AUTH_SERVER_URL);
    }

    req.session = session;
    req.c4cService = new C4CService({
        kind: 'pseudobearer',
        token: session.sapToken,
        url: session.sapUrl,
    });

    next();
}

export interface C4CAuthSession {
    sessionId: string;
    username: string;
    csrf: string;
    sapToken: string;
    sapUrl: string;
}
