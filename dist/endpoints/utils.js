"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUserFromReq_1 = __importDefault(require("../utils/getUserFromReq"));
// TODO: define all any types
function wrapGraphQLOperationForErrors(func) {
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield func(...args);
        }
        catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error(error);
            }
            if (Array.isArray(error)) {
                return {
                    errors: error
                };
            }
            else if (error.name || error.code || error.message) {
                // TODO: remove in favor of detailed logging
                if (error.field === "error") {
                    console.error(error);
                }
                return {
                    errors: [
                        {
                            field: error.field || "error",
                            message: error.message || "server error"
                        }
                    ]
                };
            }
            else if (error.errors) {
                return error;
            }
            else {
                return {
                    errors: [
                        {
                            field: "error",
                            message: "server error"
                        }
                    ]
                };
            }
        }
    });
}
exports.wrapGraphQLOperationForErrors = wrapGraphQLOperationForErrors;
function wrapGraphQLOperation(func, staticParams, inserts = []) {
    const wrappedFunc = wrapGraphQLOperationForErrors(func);
    return (params, req) => __awaiter(this, void 0, void 0, function* () {
        const initialParams = Object.assign({}, staticParams, params, { req });
        let reducedParams = initialParams;
        for (const insertFunc of inserts) {
            const result = yield insertFunc(reducedParams);
            reducedParams = Object.assign({}, reducedParams, result);
        }
        return wrappedFunc(Object.assign({}, initialParams, reducedParams));
    });
}
exports.wrapGraphQLOperation = wrapGraphQLOperation;
function insertUserCredentials(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { req, userModel } = params;
        const tokenData = req.user;
        const user = yield getUserFromReq_1.default({ req, userModel });
        return { tokenData, user };
    });
}
exports.insertUserCredentials = insertUserCredentials;
function insertChangePasswordCredentials({ req, userModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenData = req.user;
        const user = yield getUserFromReq_1.default({
            req,
            userModel,
            domain: "change-password"
        });
        return { tokenData, user };
    });
}
exports.insertChangePasswordCredentials = insertChangePasswordCredentials;
//# sourceMappingURL=utils.js.map