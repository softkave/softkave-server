import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joi-utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import blockError from "./blockError";
import { blockParamSchema, validateBlockParam } from "./validation";

// TODO: define all any parameters
export interface IGetBlockParameters {
  block: any;
  blockModel: BlockModel;
  isRequired?: boolean;
  checkPermission?: boolean;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

const getBlockJoiSchema = Joi.object().keys({});

// TODO: separate internal only params out and refactor it into a wrapper function for internal use
async function getBlock({
  block,
  blockModel,
  isRequired,
  checkPermission,
  user,
  accessControlModel
}: IGetBlockParameters) {
  // const result = validate({  }, getBlockJoiSchema);

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
