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
const argon2_1 = __importDefault(require("argon2"));
const v4_1 = __importDefault(require("uuid/v4"));
const constants_1 = __importDefault(require("../../mongo/constants"));
const RequestError_1 = __importDefault(require("../../utils/RequestError"));
const serverError_1 = __importDefault(require("../../utils/serverError"));
const createRootBlock_1 = __importDefault(require("../block/createRootBlock"));
const constants_2 = require("./constants");
const newToken_1 = __importDefault(require("./newToken"));
const userError_1 = require("./userError");
const userExists_1 = __importDefault(require("./userExists"));
const validation_1 = require("./validation");
function signup({ user, userModel, blockModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        const value = validation_1.validateUserSignupData(user);
        const userExistsResult = yield userExists_1.default({ userModel, email: user.email });
        if (!!userExistsResult && userExistsResult.userExists) {
            throw new RequestError_1.default(constants_2.userFieldNames.email, userError_1.userErrorMessages.emailAddressNotAvailable);
        }
        try {
            value.hash = yield argon2_1.default.hash(value.password);
            value.customId = v4_1.default();
            delete value.password;
            let newUser = new userModel.model(value);
            newUser = yield newUser.save();
            yield createRootBlock_1.default({ blockModel, user: newUser });
            return {
                user: newUser,
                token: newToken_1.default(newUser)
            };
        }
        catch (error) {
            // Adding a user fails with code 11000 if unique fields in this case email exists
            if (error.code === constants_1.default.indexNotUniqueErrorCode) {
                throw new RequestError_1.default(constants_2.userFieldNames.email, userError_1.userErrorMessages.emailAddressNotAvailable);
            }
            // For debugging purposes
            console.error(error);
            throw serverError_1.default.serverError;
        }
    });
}
exports.default = signup;
//# sourceMappingURL=signup.js.map