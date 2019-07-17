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
const utils_1 = require("../../utils/utils");
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
const blockError_1 = __importDefault(require("./blockError"));
const constants_1 = require("./constants");
const validation_1 = require("./validation");
function transferBlock({ sourceBlock, draggedBlock, destinationBlock, dropPosition, blockPosition, draggedBlockType, groupContext, blockModel, user, accessControlModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        sourceBlock = validation_1.validateBlockParam(sourceBlock);
        draggedBlock = validation_1.validateBlockParam(draggedBlock);
        destinationBlock = validation_1.validateBlockParam(destinationBlock);
        draggedBlockType = validation_1.validateBlockTypes([draggedBlockType])[0];
        if (groupContext) {
            groupContext = validation_1.validateGroupContexts([groupContext])[0];
        }
        const blockChildIndex = `${draggedBlockType}s.${blockPosition}`;
        const sourceBlockQuery = {
            customId: sourceBlock.customId,
            [blockChildIndex]: draggedBlock.customId
        };
        const draggedBlockQuery = {
            customId: draggedBlock.customId,
            type: draggedBlockType
        };
        const destinationBlockQuery = { customId: destinationBlock.customId };
        const queries = [sourceBlockQuery, draggedBlockQuery];
        if (sourceBlock.customId !== destinationBlock.customId) {
            queries.push(destinationBlockQuery);
        }
        const blocks = yield blockModel.model
            .find({
            $or: queries
        })
            .exec();
        blocks.forEach(block => {
            switch (block.customId) {
                case sourceBlock.customId:
                    sourceBlock = block;
                    break;
                case draggedBlock.customId:
                    draggedBlock = block;
                    break;
                case destinationBlock.customId:
                    destinationBlock = block;
                    break;
            }
        });
        // add batching of access control checks
        if (!draggedBlock) {
            throw blockError_1.default.transferDraggedBlockMissing;
        }
        else {
            yield accessControlCheck_1.default({
                user,
                accessControlModel,
                block: draggedBlock,
                CRUDActionName: actions_1.CRUDActionsMap.UPDATE
            });
        }
        if (!sourceBlock) {
            throw blockError_1.default.transferSourceBlockMissing;
        }
        else {
            yield accessControlCheck_1.default({
                user,
                accessControlModel,
                block: sourceBlock,
                CRUDActionName: actions_1.CRUDActionsMap.UPDATE
            });
        }
        if (sourceBlock.customId !== destinationBlock.customId && !destinationBlock) {
            throw blockError_1.default.transferDestinationBlockMissing;
        }
        else if (destinationBlock) {
            yield accessControlCheck_1.default({
                user,
                accessControlModel,
                block: destinationBlock,
                CRUDActionName: actions_1.CRUDActionsMap.UPDATE
            });
        }
        const pushUpdates = [];
        const pluralizedType = `${draggedBlock.type}s`;
        if (draggedBlock.type === constants_1.blockConstants.blockTypes.group) {
            const sourceBlockUpdates = {};
            if (groupContext) {
                sourceBlockUpdates[groupContext] = utils_1.move(sourceBlock[groupContext], draggedBlock.customId, dropPosition, blockError_1.default.transferDraggedBlockNotFoundInParent);
            }
            else {
                const groupTaskContext = constants_1.blockConstants.groupContexts.groupTaskContext;
                const groupProjectContext = constants_1.blockConstants.groupContexts.groupProjectContext;
                sourceBlockUpdates[groupTaskContext] = utils_1.move(sourceBlock[groupTaskContext], draggedBlock.customId, dropPosition, blockError_1.default.transferDraggedBlockNotFoundInParent);
                sourceBlockUpdates[groupProjectContext] = utils_1.move(sourceBlock[groupProjectContext], draggedBlock.customId, dropPosition, blockError_1.default.transferDraggedBlockNotFoundInParent);
            }
            sourceBlockUpdates[pluralizedType] = utils_1.move(sourceBlock[pluralizedType], draggedBlock.customId, dropPosition, blockError_1.default.transferDraggedBlockNotFoundInParent);
            pushUpdates.push({
                updateOne: {
                    filter: { customId: sourceBlock.customId },
                    update: sourceBlockUpdates
                }
            });
        }
        else if (sourceBlock.customId === destinationBlock.customId) {
            const sourceBlockUpdates = {};
            sourceBlockUpdates[pluralizedType] = utils_1.move(sourceBlock[pluralizedType], draggedBlock.customId, dropPosition, blockError_1.default.transferDraggedBlockNotFoundInParent);
            pushUpdates.push({
                updateOne: {
                    filter: { customId: sourceBlock.customId },
                    update: sourceBlockUpdates
                }
            });
        }
        else {
            const sourceBlockUpdates = {};
            const draggedBlockUpdates = {};
            const destinationBlockUpdates = {};
            const sourceParentIndex = utils_1.getIndex(draggedBlock.parents, sourceBlock.customId, blockError_1.default.transferDraggedBlockNotFoundInParent);
            sourceBlockUpdates[pluralizedType] = utils_1.remove(sourceBlock[pluralizedType], draggedBlock.customId, blockError_1.default.transferDraggedBlockNotFoundInParent);
            destinationBlockUpdates[pluralizedType] = utils_1.add(destinationBlock[pluralizedType], draggedBlock.customId, dropPosition);
            const draggedBlockParentUpdate = [...(destinationBlock.parents || [])];
            draggedBlockParentUpdate.push(destinationBlock.customId);
            draggedBlockUpdates.parents = draggedBlockParentUpdate;
            pushUpdates.push({
                updateOne: {
                    filter: { customId: sourceBlock.customId },
                    update: sourceBlockUpdates
                }
            }, {
                updateOne: {
                    filter: { customId: destinationBlock.customId },
                    update: destinationBlockUpdates
                }
            }, {
                updateOne: {
                    filter: { customId: draggedBlock.customId },
                    update: draggedBlockUpdates
                }
            }, {
                updateMany: {
                    filter: {
                        [`parents.${sourceParentIndex + 1}`]: draggedBlock.customId
                    },
                    update: draggedBlockUpdates.parents.reduce((update, id, index) => {
                        update[`parents.${index}`] = id;
                        return update;
                    }, {})
                }
            });
        }
        if (pushUpdates.length > 0) {
            yield blockModel.model.bulkWrite(pushUpdates);
        }
    });
}
exports.default = transferBlock;
//# sourceMappingURL=transferBlock.js.map