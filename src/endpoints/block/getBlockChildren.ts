import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import { blockConstants } from "./constants";
import { getParentsLength } from "./utils";
import { validateBlockTypes } from "./validation";

export interface IGetBlockChildrenParameters {
  block: IBlockDocument;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
  types: string[];
  blockModel: BlockModel;
  isBacklog: boolean;
}

async function getBlockChildren({
  block,
  user,
  accessControlModel,
  types,
  blockModel,
  isBacklog
}: IGetBlockChildrenParameters) {
  const parentBlock = block;
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.READ
  });

  if (types) {
    types = validateBlockTypes(types);
  } else {
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
