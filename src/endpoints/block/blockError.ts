import OperationError from "../../utils/OperationError";
import { IBlock } from "./block";

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
  transferDraggedBlockNotFoundInParent:
    "Transfer - transfered block not found in the source block",
  blockNotFound: "Block not found",
  roleDoesNotExist: "Role does not exist",
  accessControlOnTypeOtherThanOrg:
    "Access control is only available in organizations"
};

const blockErrorFields = {
  block: "system.block",
  invalidBlockType: "system.block.invalidBlockType",
  blockExists: "system.block.blockExists",
  transferDraggedBlockMissing: "system.block.transferDraggedBlockMissing",
  transferSourceBlockMissing: "system.block.transferSourceBlockMissing",
  transferDestinationBlockMissing:
    "system.block.transferDestinationBlockMissing",
  transferDraggedBlockNotFoundInParent:
    "system.block.transferDraggedBlockNotFoundInParent",
  blockNotFound: "system.block.blockNotFound",
  roleDoesNotExist: "system.block.roleDoesNotExist",
  invalidOperation: "system.block.invalidOperation"
};

const blockError = {
  invalidBlockType: new OperationError(
    blockErrorFields.invalidBlockType,
    blockErrorMessages.invalidBlockType
  ),

  transferDraggedBlockMissing: new OperationError(
    blockErrorFields.transferDraggedBlockMissing,
    blockErrorMessages.transferDraggedBlockMissing
  ),

  transferSourceBlockMissing: new OperationError(
    blockErrorFields.transferSourceBlockMissing,
    blockErrorMessages.transferSourceBlockMissing
  ),

  transferDestinationBlockMissing: new OperationError(
    blockErrorFields.transferDestinationBlockMissing,
    blockErrorMessages.transferDestinationBlockMissing
  ),

  transferDraggedBlockNotFoundInParent: new OperationError(
    blockErrorFields.transferDraggedBlockNotFoundInParent,
    blockErrorMessages.transferDraggedBlockNotFoundInParent
  ),

  blockNotFound: new OperationError(
    blockErrorFields.blockNotFound,
    blockErrorMessages.blockNotFound
  ),

  roleDoesNotExist: new OperationError(
    blockErrorFields.roleDoesNotExist,
    blockErrorMessages.roleDoesNotExist
  )
};

function getBlockExistsErrorMessage(block: IBlock) {
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

export default blockError;
export { blockErrorFields, blockErrorMessages, getBlockExistsErrorMessage };