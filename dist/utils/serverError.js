"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("./RequestError"));
const serverErrorMessages = {
    serverError: "Server error"
};
exports.serverErrorMessages = serverErrorMessages;
const serverErrorFields = {
    server: "system.server",
    serverError: "system.server.serverError"
};
exports.serverErrorFields = serverErrorFields;
const serverError = {
    serverError: new RequestError_1.default(serverErrorFields.serverError, serverErrorMessages.serverError)
};
exports.default = serverError;
//# sourceMappingURL=serverError.js.map