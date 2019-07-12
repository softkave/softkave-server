const { validateBlockParam } = require("./validation");
const { errors: blockErrors } = require("../../utils/blockErrorMessages");
const accessControlCheck = require("./accessControlCheck");
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
