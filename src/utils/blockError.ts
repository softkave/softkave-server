const { RequestError } = require("./error");

const blockErrorMessages = {
  invalidBlockType: "Invalid block type",
  orgExists: "Organization exists",
  groupExists: "Group exists",
  taskExists: "Task exists",
  rootExists: "Root block exists",
  projectExists: "Project exists",
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
  invalidBlockType: new RequestError(
    blockErrorFields.invalidBlockType,
    blockErrorMessages.invalidBlockType
  ),

  transferDraggedBlockMissing: new RequestError(
    blockErrorFields.transferDraggedBlockMissing,
    blockErrorMessages.transferDraggedBlockMissing
  ),

  transferSourceBlockMissing: new RequestError(
    blockErrorFields.transferSourceBlockMissing,
    blockErrorMessages.transferSourceBlockMissing
  ),

  transferDestinationBlockMissing: new RequestError(
    blockErrorFields.transferDestinationBlockMissing,
    blockErrorMessages.transferDestinationBlockMissing
  ),

  transferDraggedBlockNotFoundInParent: new RequestError(
    blockErrorFields.transferDraggedBlockNotFoundInParent,
    blockErrorMessages.transferDraggedBlockNotFoundInParent
  ),

  blockNotFound: new RequestError(
    blockErrorFields.blockNotFound,
    blockErrorMessages.blockNotFound
  ),

  roleDoesNotExist: new RequestError(
    blockErrorFields.roleDoesNotExist,
    blockErrorMessages.roleDoesNotExist
  )
};

module.exports = {
  blockError,
  blockErrorFields,
  blockErrorMessages
};
export {};
