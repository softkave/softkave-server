const { RequestError } = require("./error");

const errorMessages = {
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
  blockNotFound: "Block not found"
};

const errorFields = {
  block: "system.block",
  invalidBlockType: "system.block.invalidBlockType",
  blockExists: "system.block.blockExists",
  transferDraggedBlockMissing: "system.block.transferDraggedBlockMissing",
  transferSourceBlockMissing: "system.block.transferSourceBlockMissing",
  transferDestinationBlockMissing:
    "system.block.transferDestinationBlockMissing",
  transferDraggedBlockNotFoundInParent:
    "system.block.transferDraggedBlockNotFoundInParent",
  blockNotFound: "system.block.blockNotFound"
};

const errors = {
  invalidBlockType: new RequestError(
    errorFields.invalidBlockType,
    errorMessages.invalidBlockType
  ),

  transferDraggedBlockMissing: new RequestError(
    errorFields.transferDraggedBlockMissing,
    errorMessages.transferDraggedBlockMissing
  ),

  transferSourceBlockMissing: new RequestError(
    errorFields.transferSourceBlockMissing,
    errorMessages.transferSourceBlockMissing
  ),

  transferDestinationBlockMissing: new RequestError(
    errorFields.transferDestinationBlockMissing,
    errorMessages.transferDestinationBlockMissing
  ),

  transferDraggedBlockNotFoundInParent: new RequestError(
    errorFields.transferDraggedBlockNotFoundInParent,
    errorMessages.transferDraggedBlockNotFoundInParent
  ),

  blockNotFound: new RequestError(
    errorFields.blockNotFound,
    errorMessages.blockNotFound
  )
};

module.exports = {
  errors,
  errorFields,
  errorMessages
};
