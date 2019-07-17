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
const newToken_1 = __importDefault(require("./newToken"));
const userError_1 = __importDefault(require("./userError"));
function getUserData({ user }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!user) {
            throw userError_1.default.userDoesNotExist;
        }
        return { user, token: newToken_1.default(user) };
    });
}
exports.default = getUserData;
//# sourceMappingURL=getUserData.js.map