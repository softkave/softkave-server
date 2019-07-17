"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function httpToHttps(req, res, next) {
    if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect(["https://", req.get("Host"), req.url].join(""));
    }
    return next();
}
exports.default = httpToHttps;
//# sourceMappingURL=httpToHttps.js.map