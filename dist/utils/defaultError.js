"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const blockError_1 = __importStar(require("../endpoints/block/blockError"));
const userError_1 = __importStar(require("../endpoints/user/userError"));
const notificationError_1 = __importStar(require("./notificationError"));
const serverError_1 = __importStar(require("./serverError"));
const validationError_1 = __importStar(require("./validationError"));
const errorMessages = {
    notification: notificationError_1.notificationErrorMessages,
    server: serverError_1.serverErrorMessages,
    user: userError_1.userErrorMessages,
    validation: validationError_1.validationErrorMessages,
    block: blockError_1.blockErrorMessages
};
exports.errorMessages = errorMessages;
const errorFields = {
    notification: notificationError_1.notificationErrorFields,
    server: serverError_1.serverErrorFields,
    user: userError_1.userErrorFields,
    validation: validationError_1.validationErrorFields,
    block: blockError_1.blockErrorFields
};
exports.errorFields = errorFields;
const error = {
    notification: notificationError_1.default,
    server: serverError_1.default,
    user: userError_1.default,
    validation: validationError_1.default,
    block: blockError_1.default
};
exports.default = error;
//# sourceMappingURL=defaultError.js.map