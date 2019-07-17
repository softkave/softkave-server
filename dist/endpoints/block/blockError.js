"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../../utils/RequestError"));
const blockErrorMessages = {
    invalidBlockType: "Invalid block type",
    orgExists: "Organization exists",
    groupExists: "Group exists",
    taskExists: "Task exists",
    rootExists: "Root block exists",
    projectExists: "Project exists",
    blockExists: "Block exists",
    transferSourceBlockMissing: "Transfer - source block missing",
    transferDraggedBlockMissing: "Transfer - transfered block missing",
    transferDestinationBlockMissing: "Transfer - destination block missing",
    transferDraggedBlockNotFoundInParent: "Transfer - transfered block not found in the source block",
    blockNotFound: "Block not found",
    roleDoesNotExist: "Role does not exist",
    accessControlOnTypeOtherThanOrg: "Access control is only available in organizations"
};
exports.blockErrorMessages = blockErrorMessages;
const blockErrorFields = {
    block: "system.block",
    invalidBlockType: "system.block.invalidBlockType",
    blockExists: "system.block.blockExists",
    transferDraggedBlockMissing: "system.block.transferDraggedBlockMissing",
    transferSourceBlockMissing: "system.block.transferSourceBlockMissing",
    transferDestinationBlockMissing: "system.block.transferDestinationBlockMissing",
    transferDraggedBlockNotFoundInParent: "system.block.transferDraggedBlockNotFoundInParent",
    blockNotFound: "system.block.blockNotFound",
    roleDoesNotExist: "system.block.roleDoesNotExist",
    invalidOperation: "system.block.invalidOperation"
};
exports.blockErrorFields = blockErrorFields;
const blockError = {
    invalidBlockType: new RequestError_1.default(blockErrorFields.invalidBlockType, blockErrorMessages.invalidBlockType),
    transferDraggedBlockMissing: new RequestError_1.default(blockErrorFields.transferDraggedBlockMissing, blockErrorMessages.transferDraggedBlockMissing),
    transferSourceBlockMissing: new RequestError_1.default(blockErrorFields.transferSourceBlockMissing, blockErrorMessages.transferSourceBlockMissing),
    transferDestinationBlockMissing: new RequestError_1.default(blockErrorFields.transferDestinationBlockMissing, blockErrorMessages.transferDestinationBlockMissing),
    transferDraggedBlockNotFoundInParent: new RequestError_1.default(blockErrorFields.transferDraggedBlockNotFoundInParent, blockErrorMessages.transferDraggedBlockNotFoundInParent),
    blockNotFound: new RequestError_1.default(blockErrorFields.blockNotFound, blockErrorMessages.blockNotFound),
    roleDoesNotExist: new RequestError_1.default(blockErrorFields.roleDoesNotExist, blockErrorMessages.roleDoesNotExist)
};
function getBlockExistsErrorMessage(block) {
    switch (block.type) {
        case "org":
            return blockErrorMessages.orgExists;
        case "group":
            return blockErrorMessages.groupExists;
        case "project":
            return blockErrorMessages.projectExists;
        case "org":
            return blockErrorMessages.orgExists;
        default:
            return blockErrorMessages.blockExists;
    }
}
exports.getBlockExistsErrorMessage = getBlockExistsErrorMessage;
exports.default = blockError;
//# sourceMappingURL=blockError.js.map