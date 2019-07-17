"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../../utils/RequestError"));
const userErrorMessages = {
    userAccessRevoked: "Your access has been revoked",
    invalidCredentials: "Invalid credentials",
    credentialsExpired: "Credentials expired",
    emailAddressNotAvailable: "Email address is not available",
    invalidEmail: "Input is not a valid email address",
    permissionDenied: "Permission denied",
    loginAgain: "Please, login again",
    userDoesNotExist: "User does not exist",
    collaboratorDoesNotExist: "Collaborator does not exist",
    invalidLoginCredentials: "Invalid email or password"
};
exports.userErrorMessages = userErrorMessages;
const userErrorFields = {
    user: "system.user",
    userAccessRevoked: "system.user.userAccessRevoked",
    invalidCredentials: "system.user.invalidCredentials",
    credentialsExpired: "system.user.credentialsExpired",
    loginAgain: "system.user.loginAgain",
    invalidLoginCredentials: "system.user.invalidLoginCredentials",
    permissionDenied: "system.user.permissionDenied",
    userDoesNotExist: "system.user.userDoesNotExist",
    emailAddressNotAvailable: "system.user.emailAddressNotAvailable",
    invalidEmail: "system.user.invalidEmail",
    collaboratorDoesNotExist: "system.user.collaboratorDoesNotExist"
};
exports.userErrorFields = userErrorFields;
const userError = {
    userAccessRevoked: new RequestError_1.default(userErrorFields.userAccessRevoked, userErrorMessages.userAccessRevoked),
    credentialsExpired: new RequestError_1.default(userErrorFields.credentialsExpired, userErrorMessages.credentialsExpired),
    loginAgain: new RequestError_1.default(userErrorFields.loginAgain, userErrorMessages.loginAgain),
    permissionDenied: new RequestError_1.default(userErrorFields.permissionDenied, userErrorMessages.permissionDenied),
    invalidCredentials: new RequestError_1.default(userErrorFields.invalidCredentials, userErrorMessages.invalidCredentials),
    userDoesNotExist: new RequestError_1.default(userErrorFields.userDoesNotExist, userErrorMessages.userDoesNotExist),
    invalidLoginCredentials: new RequestError_1.default(userErrorFields.invalidLoginCredentials, userErrorMessages.invalidLoginCredentials),
    emailAddressNotAvailable: new RequestError_1.default(userErrorFields.emailAddressNotAvailable, userErrorMessages.emailAddressNotAvailable),
    collaboratorDoesNotExist: new RequestError_1.default(userErrorFields.collaboratorDoesNotExist, userErrorMessages.collaboratorDoesNotExist)
};
exports.default = userError;
//# sourceMappingURL=userError.js.map