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
const changePassword_1 = __importDefault(require("./changePassword"));
const userError_1 = __importDefault(require("./userError"));
function changePasswordWithToken(arg) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tokenData } = arg;
        if (tokenData && tokenData.domain !== jwtConstants_1.default.domains.changePassword) {
            throw userError_1.default.invalidCredentials;
        }
        return yield changePassword_1.default(arg);
    });
}
exports.default = changePasswordWithToken;
//# sourceMappingURL=changePasswordWithToken.js.map