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
const jwtConstants_1 = __importDefault(require("../../utils/jwtConstants"));
const newToken_1 = __importDefault(require("./newToken"));
const sendChangePasswordEmail_1 = __importDefault(require("./sendChangePasswordEmail"));
const userError_1 = __importDefault(require("./userError"));
const utils_1 = require("./utils");
const validation_1 = require("./validation");
const linkExpirationDuration = "1 day";
function forgotPassword({ email, userModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        const emailValue = validation_1.validateEmail(email);
        const user = yield userModel.model
            .findOne({
            email: emailValue
        })
            .exec();
        if (!user) {
            throw userError_1.default.userDoesNotExist;
        }
        const expirationDuration = linkExpirationDuration;
        const token = newToken_1.default(user, {
            domain: jwtConstants_1.default.domains.changePassword,
            expiresIn: expirationDuration
        });
        yield sendChangePasswordEmail_1.default({
            emailAddress: user.email,
            query: { t: token },
            expiration: expirationDuration
        });
        user.forgotPasswordHistory = utils_1.addEntryToPasswordDateLog(user.forgotPasswordHistory);
        user.save();
    });
}
exports.default = forgotPassword;
//# sourceMappingURL=forgotPassword.js.map