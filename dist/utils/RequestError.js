"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestError extends Error {
    constructor(field, message) {
        super(message);
        this.field = field;
        this.name = "RequestError";
    }
}
exports.default = RequestError;
//# sourceMappingURL=RequestError.js.map