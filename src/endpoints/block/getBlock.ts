import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import { blockErrors } from "./blockError";
import { validateBlockParam } from "./validation";

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

export default getBlock;
