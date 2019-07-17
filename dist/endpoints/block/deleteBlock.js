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
const deleteOrgIDFromUser_1 = __importDefault(require("../user/deleteOrgIDFromUser"));
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
function deleteBlock({ block, blockModel, user, accessControlModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield accessControlCheck_1.default({
            user,
            block,
            accessControlModel,
            CRUDActionName: actions_1.CRUDActionsMap.DELETE
        });
        yield blockModel.model
            .deleteMany({
            $or: [{ customId: block.customId }, { parents: block.customId }]
        })
            .exec();
        const pluralizedType = `${block.type}s`;
        const update = {
            [pluralizedType]: block.customId
        };
        if (block.type === constants_1.blockConstants.blockTypes.group) {
            update.groupTaskContext = block.customId;
            update.groupProjectContext = block.customId;
        }
        yield blockModel.model
            .updateOne({ customId: utils_1.getImmediateParentID(block) }, {
            $pull: update
        })
            .exec();
        // TODO: scrub user collection for unreferenced orgIds
        yield deleteOrgIDFromUser_1.default({ user, id: block.customId });
    });
}
exports.default = deleteBlock;
//# sourceMappingURL=deleteBlock.js.map