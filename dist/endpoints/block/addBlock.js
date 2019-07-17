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
const RequestError_1 = __importDefault(require("../../utils/RequestError"));
const validationError_1 = require("../../utils/validationError");
const addOrgIDToUser_1 = __importDefault(require("../user/addOrgIDToUser"));
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
const addBlockToDB_1 = __importDefault(require("./addBlockToDB"));
const blockError_1 = __importDefault(require("./blockError"));
const canReadBlock_1 = __importDefault(require("./canReadBlock"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const validation_1 = require("./validation");
function addBlock({ blockModel, user, block, accessControlModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        block = validation_1.validateBlock(block);
        yield accessControlCheck_1.default({
            user,
            block,
            accessControlModel,
            CRUDActionName: actions_1.CRUDActionsMap.CREATE
        });
        if (block.type === constants_1.blockConstants.blockTypes.root) {
            throw blockError_1.default.invalidBlockType;
        }
        if (block.type === constants_1.blockConstants.blockTypes.org) {
            const result = yield addBlockToDB_1.default({ block, blockModel, user });
            // TODO: scrub for orgs that are not added to user and add or clean them
            // Continuation: you can do this when user tries to read them, or add them again
            yield addOrgIDToUser_1.default({ user, ID: result.customId });
            return {
                block: result
            };
        }
        if (!utils_1.blockHasParents(block)) {
            throw new RequestError_1.default(constants_1.blockFieldNames.parents, validationError_1.validationErrorMessages.dataInvalid);
        }
        const rootParentId = block.parents[0];
        const rootParent = yield blockModel.model
            .findOne({ customId: rootParentId })
            .lean()
            .exec();
        yield canReadBlock_1.default({ user, block: rootParent });
        block = yield addBlockToDB_1.default({ block, blockModel, user });
        const pluralizedType = `${block.type}s`;
        const update = {
            [pluralizedType]: block.customId
        };
        if (block.type === constants_1.blockConstants.blockTypes.group) {
            update.groupTaskContext = block.customId;
            update.groupProjectContext = block.customId;
        }
        yield blockModel.model
            .updateOne({ customId: utils_1.getImmediateParentID(block) }, { $addToSet: update })
            .exec();
        return {
            block
        };
    });
}
exports.default = addBlock;
//# sourceMappingURL=addBlock.js.map