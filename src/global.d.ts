declare namespace Express {
    export interface Request {
        c4cService: import('@pta-kyma/c4c-odata-access').C4CService;
        session: import('./auth').C4CAuthSession;
    }
}
