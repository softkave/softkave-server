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
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const validation_1 = require("./validation");
function getBlockChildren({ block, user, accessControlModel, types, blockModel, isBacklog }) {
    return __awaiter(this, void 0, void 0, function* () {
        const parentBlock = block;
        yield accessControlCheck_1.default({
            user,
            block,
            accessControlModel,
            CRUDActionName: actions_1.CRUDActionsMap.READ
        });
        if (types) {
            types = validation_1.validateBlockTypes(types);
        }
        else {
            types = constants_1.blockConstants.blockTypesArray;
        }
        const blocks = yield blockModel.model.find({
            isBacklog,
            parents: {
                $size: utils_1.getParentsLength(parentBlock) + 1,
                $eq: parentBlock.customId
            },
            type: {
                $in: types
            }
        });
        return {
            blocks
        };
    });
}
exports.default = getBlockChildren;
//# sourceMappingURL=getBlockChildren.js.map