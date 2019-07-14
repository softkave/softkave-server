const { validateBlockParam } = require("./validation");
const { blockErrors } = require("../../utils/blockError");
const accessControlCheck = require("./access-control-check");
const { CRUDActionsMap } = require("./actions");

async function getBlock({
  block,
  blockModel,
  isRequired,
  checkPermission,
  user,
  accessControlModel
}) {
  block = validateBlockParam(block);
  block = await blockModel.model.findOne({ customId: block.customId }).exec();

  if (!block && isRequired) {
    throw blockErrors.blockNotFound;
  }

  if (checkPermission && user) {
    await accessControlCheck({
      user,
      block,
      accessControlModel,
      CRUDActionName: CRUDActionsMap.READ
    });
  }

  return block;
}

module.exports = getBlock;
export {};
