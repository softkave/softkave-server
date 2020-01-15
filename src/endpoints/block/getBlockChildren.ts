import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IBlockDocument } from "../../mongo/block";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joiUtils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import { blockConstants } from "./constants";
import { getParentsLength } from "./utils";
import { blockTypesSchema } from "./validation";

export interface IGetBlockChildrenParameters {
  block: IBlockDocument;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
  types?: string[];
  blockModel: BlockModel;
  isBacklog: boolean;
}

const getBlockChildrenJoiSchema = Joi.object().keys({
  types: blockTypesSchema,
  isBacklog: Joi.boolean().optional()
});

async function getBlockChildren({
  block,
  user,
  accessControlModel,
  types,
  blockModel,
  isBacklog
}: IGetBlockChildrenParameters) {
  const result = validate({ types, isBacklog }, getBlockChildrenJoiSchema);

  types = result.types;
  isBacklog = result.isBacklog;

  const parentBlock = block;
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.READ
  });

  if (!types) {
    types = blockConstants.blockTypesArray;
  }

  const blocks = await blockModel.model.find({
    isBacklog,
    parents: {
      $size: getParentsLength(parentBlock) + 1,
      $eq: parentBlock.customId
    },
    type: {
      $in: types
    }
  });

  return {
    blocks
  };
}

export default getBlockChildren;
