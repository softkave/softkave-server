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
const userError_1 = __importDefault(require("../endpoints/user/userError"));
const jwtConstants_1 = __importDefault(require("./jwtConstants"));
function getUserFromReq({ req, userModel, domain = jwtConstants_1.default.domains.login }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.fetchedUser) {
            return req.fetchedUser;
        }
        if (!req.user || !req.user.customId || req.user.domain !== domain) {
            throw userError_1.default.invalidCredentials;
        }
        const userTokenData = req.user;
        let user = null;
        const query = {
            customId: userTokenData.customId
        };
        // TODO: transform _id to id in all db fetch
        user = yield userModel.model.findOne(query).exec();
        if (!user) {
            throw userError_1.default.permissionDenied;
        }
        req.user = user;
        req.fetchedUser = user;
        if (Array.isArray(user.changePasswordHistory)) {
            if (Array.isArray(userTokenData.changePasswordHistory)) {
                user.changePasswordHistory.forEach((time, index) => {
                    if (time !== userTokenData.changePasswordHistory[index]) {
                        throw userError_1.default.loginAgain;
                    }
                });
            }
            else {
                throw userError_1.default.loginAgain;
            }
        }
        return user;
    });
}
exports.default = getUserFromReq;
//# sourceMappingURL=getUserFromReq.js.map