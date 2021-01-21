"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMaybeAxiosError = exports.requestSpecificLoggerMiddleware = exports.logger = void 0;
var tslib_1 = require("tslib");
var on_finished_1 = tslib_1.__importDefault(require("on-finished"));
var winston_1 = tslib_1.__importStar(require("winston"));
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, colorize = winston_1.format.colorize;
var transports = [];
if (process.env.NODE_ENV === 'production') {
    transports.push(new winston_1.default.transports.Console({
        format: combine(winston_1.format.printf(function (i) {
            if (i.requestId) {
                return i.level + " [" + i.requestId + "] " + i.message;
            }
            else {
                return i.level + " " + i.message;
            }
        })),
    }));
}
else {
    transports.push(new winston_1.default.transports.Console({
        format: combine(colorize(), timestamp(), winston_1.format.printf(function (i) {
            if (i.requestId) {
                return i.timestamp + " " + i.level + " [" + i.requestId + "] " + i.message;
            }
            else {
                return i.timestamp + " " + i.level + " " + i.message;
            }
        })),
    }));
}
exports.logger = winston_1.createLogger({
    level: 'debug',
    transports: transports,
});
var nextRequestId = 1;
function requestSpecificLoggerMiddleware(logStartAndEnd) {
    if (logStartAndEnd === void 0) { logStartAndEnd = true; }
    return function (req, res, next) {
        req.logger = exports.logger.child({ requestId: nextRequestId });
        var requestInfo;
        if (logStartAndEnd) {
            requestInfo = req.method + " " + req.url;
            req.logger.debug("Request " + requestInfo + " starting");
        }
        nextRequestId++;
        next();
        if (logStartAndEnd) {
            on_finished_1.default(res, function (err, msg) {
                if (err) {
                    req.logger.error("Request " + requestInfo + " ended with error: " + err.name + " " + err.message + " ");
                }
                req.logger.debug("End of request " + requestInfo + ": " + msg.statusCode + " " + msg.statusMessage);
            });
        }
    };
}
exports.requestSpecificLoggerMiddleware = requestSpecificLoggerMiddleware;
function logMaybeAxiosError(logger, err) {
    if (!logger)
        return;
    var axiosError = err;
    if (axiosError.isAxiosError) {
        logger.error(axiosError.message);
        logger.error(axiosError.toJSON());
    }
    else {
        logger.error(err.message);
    }
}
exports.logMaybeAxiosError = logMaybeAxiosError;
//# sourceMappingURL=logging.js.map