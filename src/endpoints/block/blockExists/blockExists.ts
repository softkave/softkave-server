import { IGetUserDataContext, IGetUserDataResult } from "./types";

export interface IBlockExistsParameters {
  block: IBlock;
  blockModel: BlockModel;
}

const blockExistsJoiSchema = Joi.object().keys({
  block: blockJoiSchema
});

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
  const result = validate({ block }, blockExistsJoiSchema);
  block = result.block;

  const { name, type, customId, parents } = block;
  const blockExistQuery: any = {
    type: type.toLowerCase(),
    lowerCasedName: name.toLowerCase()
  };

  if (parents) {
    blockExistQuery.parents = parents;
  }

  if (customId) {
    blockExistQuery.customId = customId;
  }

  const blockExistsResult = await blockModel.model
    .findOne(blockExistQuery, "customId")
    .exec();

  return blockExistsResult;
}

export default getUserData;
