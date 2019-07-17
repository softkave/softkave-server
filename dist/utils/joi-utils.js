"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const get_1 = __importDefault(require("lodash/get"));
const joiError_1 = require("./joiError");
const RequestError_1 = __importDefault(require("./RequestError"));
const validationError_1 = require("./validationError");
const typePath = "details.0.type";
const pathPath = "details.0.path";
// TODO: define all any types
function validate(data, schema) {
    const { error, value } = joi_1.default.validate(data, schema, {
        abortEarly: false,
        convert: true
    });
    if (error) {
        const errorArray = [];
        const type = get_1.default(error, typePath);
        let path = get_1.default(error, pathPath);
        path = Array(path).join(".");
        const func = get_1.default(joiError_1.joiErrorMessages, type);
        if (typeof func === "function") {
            const message = func(error);
            errorArray.push(new RequestError_1.default(path, message));
        }
        else {
            errorArray.push(new RequestError_1.default(path, validationError_1.validationErrorMessages.dataInvalid));
        }
        return errorArray;
    }
    return value;
}
exports.validate = validate;
//# sourceMappingURL=joi-utils.js.map