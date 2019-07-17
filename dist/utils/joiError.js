"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_1 = __importDefault(require("lodash/get"));
const userError_1 = require("../endpoints/user/userError");
const validationError_1 = require("./validationError");
const limitPath = "details.0.context.limit";
const labelPath = "details.0.context.label";
// define all any
function getDataInvalidErrorMessage() {
    return validationError_1.validationErrorMessages.dataInvalid;
}
function getRequiredErrorMessage() {
    return validationError_1.validationErrorMessages.requiredError;
}
function getMinErrorMessage(error, type) {
    const min = get_1.default(error, limitPath);
    const label = get_1.default(error, labelPath);
    if (!min || !label) {
        return getDataInvalidErrorMessage();
    }
    return validationError_1.getErrorMessageWithMin(min, type);
}
function getMaxErrorMessage(error, type) {
    const max = get_1.default(error, limitPath);
    const label = get_1.default(error, labelPath);
    if (!max || !label) {
        return getDataInvalidErrorMessage();
    }
    return validationError_1.getErrorMessageWithMax(max, type);
}
function getUniqueErrorMessage() {
    return validationError_1.validationErrorMessages.notUniqueError;
}
function getEmailErrorMessage() {
    return userError_1.userErrorMessages.invalidEmail;
}
const joiErrorMessages = {
    "any.required": getRequiredErrorMessage,
    "any.empty": getRequiredErrorMessage,
    "any.allowOnly": getDataInvalidErrorMessage,
    "string.base": getDataInvalidErrorMessage,
    "string.min": (error) => getMinErrorMessage(error, "string"),
    "string.max": (error) => getMaxErrorMessage(error, "string"),
    "string.regex.base": getDataInvalidErrorMessage,
    "string.email": getEmailErrorMessage,
    "string.guid": getDataInvalidErrorMessage,
    "number.base": getDataInvalidErrorMessage,
    "number.min": (error) => getMinErrorMessage(error, "number"),
    "number.max": (error) => getMaxErrorMessage(error, "number"),
    "array.base": getDataInvalidErrorMessage,
    "array.unique": getUniqueErrorMessage,
    "array.min": (error) => getMinErrorMessage(error, "array"),
    "array.max": (error) => getMaxErrorMessage(error, "array")
};
exports.joiErrorMessages = joiErrorMessages;
//# sourceMappingURL=joiError.js.map