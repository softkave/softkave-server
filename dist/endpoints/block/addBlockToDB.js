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
const constants_1 = __importDefault(require("../../mongo/constants"));
const RequestError_1 = __importDefault(require("../../utils/RequestError"));
const validationError_1 = require("../../utils/validationError");
const blockError_1 = require("./blockError");
const blockExists_1 = __importDefault(require("./blockExists"));
const constants_2 = require("./constants");
function addBlockToDB({ block, blockModel, user }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!block.customId) {
                throw new RequestError_1.default(constants_2.blockFieldNames.customId, validationError_1.validationErrorMessages.dataInvalid);
            }
            if (yield blockExists_1.default({
                blockModel,
                block: {
                    name: block.name,
                    type: block.type,
                    parents: block.parents
                }
            })) {
                // TODO: replace the generic blockExists with the right type
                throw new RequestError_1.default(blockError_1.blockErrorFields.blockExists, blockError_1.getBlockExistsErrorMessage(block));
            }
            block.createdBy = user.customId;
            block.createdAt = Date.now();
            let newBlock = new blockModel.model(block);
            newBlock = yield newBlock.save();
            return newBlock;
        }
        catch (error) {
            if (error.code === constants_1.default.indexNotUniqueErrorCode) {
                console.log(`Block with same id - ${block.customId}`);
                throw new RequestError_1.default(blockError_1.blockErrorFields.blockExists, blockError_1.getBlockExistsErrorMessage(block));
            }
            throw error;
        }
    });
}
exports.default = addBlockToDB;
//# sourceMappingURL=addBlockToDB.js.map