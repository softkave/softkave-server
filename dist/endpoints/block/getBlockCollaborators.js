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
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
function getBlockCollaborators({ block, userModel, user, accessControlModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield accessControlCheck_1.default({
            user,
            block,
            accessControlModel,
            CRUDActionName: actions_1.CRUDActionsMap.READ
        });
        const collaborators = yield userModel.model
            .find({
            orgs: block.customId
        }, "name email createdAt customId")
            .lean()
            .exec();
        return {
            collaborators
        };
    });
}
exports.default = getBlockCollaborators;
//# sourceMappingURL=getBlockCollaborators.js.map