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
const blockError_1 = __importDefault(require("./blockError"));
const utils_1 = require("./utils");
function getRole({ accessControlModel, roleName, block, required }) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            roleName,
            orgId: utils_1.getRootParentID(block)
        };
        const role = yield accessControlModel.model.findOne(query).exec();
        if (!role && required) {
            throw blockError_1.default.roleDoesNotExist;
        }
        return role;
    });
}
exports.default = getRole;
//# sourceMappingURL=getRole.js.map