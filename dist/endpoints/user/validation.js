"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const trim_1 = __importDefault(require("validator/lib/trim"));
const joi_utils_1 = require("../../utils/joi-utils");
const validation_utils_1 = require("../../utils/validation-utils");
const constants_1 = require("./constants");
const emailSchema = joi_1.default.string()
    .required()
    .trim()
    .lowercase()
    .email();
const passwordSchema = joi_1.default.string()
    .required()
    .trim()
    .min(constants_1.userConstants.minPasswordLength)
    .max(constants_1.userConstants.maxPasswordLength)
    .regex(validation_utils_1.regEx.passwordPattern);
const nameSchema = joi_1.default.string()
    .required()
    .trim()
    .min(constants_1.userConstants.minNameLength)
    .max(constants_1.userConstants.maxNameLength);
const userSignupSchema = joi_1.default.object().keys({
    name: nameSchema,
    password: passwordSchema,
    email: emailSchema,
    color: joi_1.default.string()
        .trim()
        .lowercase()
        .regex(validation_utils_1.regEx.hexColorPattern)
});
const updateUserSchema = joi_1.default.object().keys({
    name: nameSchema,
    lastNotificationCheckTime: joi_1.default.number().required()
});
const collaborationRequestResponseSchema = joi_1.default.string()
    .trim()
    .lowercase()
    .valid(["accepted", "declined"]);
const collaborationRequestSchema = joi_1.default.object().keys({
    readAt: joi_1.default.number()
});
// TODO: define data's type
function trimUserData(data) {
    const trimmedData = {};
    if (data.name) {
        trimmedData.name = trim_1.default(data.name);
    }
    if (data.password) {
        trimmedData.password = trim_1.default(data.password);
    }
    if (data.email) {
        trimmedData.email = trim_1.default(data.email);
    }
    return trimmedData;
}
exports.trimUserData = trimUserData;
// TODO: define data's type
function validateUserSignupData(data) {
    const value = joi_utils_1.validate(data, userSignupSchema);
    return value;
}
exports.validateUserSignupData = validateUserSignupData;
function validateEmail(email) {
    const value = joi_utils_1.validate(email, emailSchema);
    return value;
}
exports.validateEmail = validateEmail;
function validatePassword(password) {
    const value = joi_utils_1.validate(password, passwordSchema);
    return value;
}
exports.validatePassword = validatePassword;
// TODO: define data's type
function validateUpdateUserData(data) {
    const value = joi_utils_1.validate(data, updateUserSchema);
    return value;
}
exports.validateUpdateUserData = validateUpdateUserData;
// TODO: define request's type
function validateCollaborationRequest(request) {
    return joi_utils_1.validate(request, collaborationRequestSchema);
}
exports.validateCollaborationRequest = validateCollaborationRequest;
function validateCollaborationRequestResponse(response) {
    return joi_utils_1.validate(response, collaborationRequestResponseSchema);
}
exports.validateCollaborationRequestResponse = validateCollaborationRequestResponse;
//# sourceMappingURL=validation.js.map