import { IGetUserDataContext, IGetUserDataResult } from "./types";

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

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
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
}

export default getUserData;
