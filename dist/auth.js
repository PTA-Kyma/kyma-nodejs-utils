"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callC4CService = exports.authMiddleware = void 0;
var tslib_1 = require("tslib");
var c4c_odata_access_1 = require("@pta-kyma/c4c-odata-access");
var axios_1 = tslib_1.__importDefault(require("axios"));
var logging_1 = require("./logging");
var AUTH_SERVER_URL = process.env.AUTH_SERVER_URL;
if (!AUTH_SERVER_URL) {
    throw new Error('No AUTH_SERVER_URL!');
}
var authClient = axios_1.default.create({
    baseURL: AUTH_SERVER_URL,
    headers: {
        'Content-Type': 'text/plain',
    },
});
var sessions = {};
function authMiddleware(req, res, next) {
    var _a, _b, _c;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var sessionIdHeader, sessionId, session, code, err_1, err_2;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sessionIdHeader = req.headers['x-session'];
                    if (sessionIdHeader && typeof sessionIdHeader !== 'string') {
                        return [2 /*return*/, res.status(403).send('Bad format of X-Session')];
                    }
                    sessionId = sessionIdHeader;
                    session = sessionId && typeof sessionId === 'string' && sessions[sessionId];
                    if (!(req.path === '/login')) return [3 /*break*/, 11];
                    code = req.headers['x-code'];
                    if (!code) return [3 /*break*/, 5];
                    (_a = req.logger) === null || _a === void 0 ? void 0 : _a.debug("Authenticating against server with code " + code + "...");
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, authClient.post('/token', code)];
                case 2:
                    session = (_d.sent()).data;
                    // ok, good, save that session and return to user
                    sessions[session.sessionId] = session;
                    return [2 /*return*/, res.status(200).send({
                            sessionId: session.sessionId,
                            username: session.username,
                            sapUrl: session.sapUrl,
                        })];
                case 3:
                    err_1 = _d.sent();
                    logging_1.logMaybeAxiosError(req.logger, err_1);
                    return [2 /*return*/, res.status(500).send('Failed to verify code')];
                case 4: return [3 /*break*/, 11];
                case 5:
                    if (!sessionId) return [3 /*break*/, 10];
                    (_b = req.logger) === null || _b === void 0 ? void 0 : _b.debug('Authenticating with sessionId...');
                    _d.label = 6;
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, authClient.post('/session', sessionId)];
                case 7:
                    session = (_d.sent()).data;
                    // sessionId is indeed correct, so add session to our cache
                    sessions[sessionId] = session;
                    return [2 /*return*/, res.status(200).send({
                            sessionId: session.sessionId,
                            username: session.username,
                            sapUrl: session.sapUrl,
                        })];
                case 8:
                    err_2 = _d.sent();
                    logging_1.logMaybeAxiosError(req.logger, err_2);
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 11];
                case 10:
                    (_c = req.logger) === null || _c === void 0 ? void 0 : _c.debug('Called login with neither x-session nor x-code...');
                    return [2 /*return*/, res.status(403).send('Please provide either an x-code or x-session header')];
                case 11:
                    if (!session) {
                        return [2 /*return*/, res.status(403).send(AUTH_SERVER_URL)];
                    }
                    req.session = session;
                    req.c4cService = new c4c_odata_access_1.C4CService({
                        kind: 'pseudobearer',
                        token: session.sapToken,
                        url: session.sapUrl,
                    });
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
exports.authMiddleware = authMiddleware;
function callC4CService(req) {
    console.log(req.c4cService);
}
exports.callC4CService = callC4CService;
//# sourceMappingURL=auth.js.map