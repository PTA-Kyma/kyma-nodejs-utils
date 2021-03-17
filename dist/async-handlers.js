"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePost = exports.handleGet = exports.handleGetWithFilesystemCache = void 0;
var tslib_1 = require("tslib");
var logging_1 = require("./logging");
var fs_1 = require("fs");
var body_parser_1 = tslib_1.__importDefault(require("body-parser"));
function handleGetWithFilesystemCache(app, path, func) {
    var _this = this;
    app.get(path, function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var cacheFilePath, result, _a, _b, _c, result, err_1;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cacheFilePath = './tmp/' + req.url.replace(/\//g, '_') + '.json';
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs_1.promises.readFile(cacheFilePath, 'utf-8')];
                case 2:
                    result = _b.apply(_a, [_d.sent()]);
                    req.logger.debug('Data from cache');
                    return [2 /*return*/, res.send(result)];
                case 3:
                    _c = _d.sent();
                    req.logger.debug('Failed to get from cache');
                    return [3 /*break*/, 4];
                case 4:
                    _d.trys.push([4, 7, , 8]);
                    return [4 /*yield*/, func(req)];
                case 5:
                    result = _d.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(cacheFilePath, JSON.stringify(result, null, '\t'), 'utf-8')];
                case 6:
                    _d.sent();
                    res.send(result);
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _d.sent();
                    logging_1.logMaybeAxiosError(req.logger, err_1);
                    res.status(500).send('Failed to process');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
}
exports.handleGetWithFilesystemCache = handleGetWithFilesystemCache;
function handleGet(app, path, func) {
    var _this = this;
    app.get(path, function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, func(req, res)];
                case 1:
                    result = _a.sent();
                    res.send(result);
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    logging_1.logMaybeAxiosError(req.logger, err_2);
                    res.status(500).send('Failed to process');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
exports.handleGet = handleGet;
function handlePost(app, path, func) {
    var _this = this;
    app.post(path, body_parser_1.default.json(), function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, func(req, res)];
                case 1:
                    result = _a.sent();
                    res.send(result);
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    logging_1.logMaybeAxiosError(req.logger, err_3);
                    res.status(500).send('Failed to process');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
exports.handlePost = handlePost;
//# sourceMappingURL=async-handlers.js.map