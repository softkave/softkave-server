"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const isHexColor_1 = __importDefault(require("validator/lib/isHexColor"));
const trim_1 = __importDefault(require("validator/lib/trim"));
const joi_utils_1 = require("./joi-utils");
const RequestError_1 = __importDefault(require("./RequestError"));
const validationError_1 = require("./validationError");
// const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{5,}$/;
const passwordPattern = /[A-Za-z0-9!()?_`~#$^&*+=]/;
const stringPattern = /^[\w ]*$/;
const hexColorPattern = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/;
const regEx = {
    passwordPattern,
    stringPattern,
    hexColorPattern
};
exports.regEx = regEx;
const uuidSchema = joi_1.default.string()
    .guid()
    .trim();
const joiSchemas = {
    uuidSchema
};
exports.joiSchemas = joiSchemas;
function validateUUID(uuid) {
    const value = joi_utils_1.validate(uuid, uuidSchema);
    return value;
}
function validateColor(field, color, message = validationError_1.validationErrorMessages.invalidColor) {
    color = trim_1.default(color);
    if (!isHexColor_1.default(color)) {
        throw new RequestError_1.default(field, message);
    }
}
const validators = {
    validateUUID,
    validateColor
};
exports.validators = validators;
//# sourceMappingURL=validation-utils.js.map