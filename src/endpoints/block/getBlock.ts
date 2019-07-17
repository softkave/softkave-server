import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import blockError from "./blockError";
import { validateBlockParam } from "./validation";

// TODO: define all any parameters
export interface IGetBlockParameters {
  block: any;
  blockModel: BlockModel;
  isRequired?: boolean;
  checkPermission?: boolean;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

async function getBlock({
  block,
  blockModel,
  isRequired,
  checkPermission,
  user,
  accessControlModel
}: IGetBlockParameters) {
  block = validateBlockParam(block);
  block = await blockModel.model.findOne({ customId: block.customId }).exec();

  if (!block && isRequired) {
    throw blockError.blockNotFound;
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
