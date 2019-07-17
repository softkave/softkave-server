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
const newToken_1 = __importDefault(require("./newToken"));
const userError_1 = __importDefault(require("./userError"));
const validation_1 = require("./validation");
function login({ email, password, userModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        email = validation_1.validateEmail(email);
        password = validation_1.validatePassword(password);
        const userData = yield userModel.model
            .findOne({
            email
        })
            .lean()
            .exec();
        if (!userData || !(yield argon2_1.default.verify(userData.hash, password))) {
            throw userError_1.default.invalidLoginCredentials;
        }
        return {
            user: userData,
            token: newToken_1.default(userData)
        };
    });
}
exports.default = login;
//# sourceMappingURL=login.js.map