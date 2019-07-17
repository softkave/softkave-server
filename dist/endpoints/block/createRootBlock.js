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
const randomcolor_1 = __importDefault(require("randomcolor"));
const v4_1 = __importDefault(require("uuid/v4"));
const addBlockToDB_1 = __importDefault(require("../block/addBlockToDB"));
const constants_1 = require("./constants");
// TODO: look for users that have no root block and create one for them
function createRootBlock({ user, blockModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootBlock = {
            customId: v4_1.default(),
            name: `root_${user.customId}`,
            createdAt: Date.now(),
            color: randomcolor_1.default(),
            type: constants_1.blockConstants.blockTypes.root,
            createdBy: user.customId
        };
        // TODO: redefine IBlock to make the non-required fields optional
        rootBlock = yield addBlockToDB_1.default({
            user,
            blockModel,
            block: rootBlock
        });
        user.rootBlockId = rootBlock.customId;
        yield user.save();
        return {
            block: rootBlock
        };
    });
}
exports.default = createRootBlock;
//# sourceMappingURL=createRootBlock.js.map