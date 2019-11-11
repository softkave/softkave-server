import Joi from "joi";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joi-utils";
import { IBlock } from "./block";
import { blockJoiSchema } from "./validation";

export interface IBlockExistsParameters {
  block: IBlock;
  blockModel: BlockModel;
}

const blockExistsJoiSchema = Joi.object().keys({
  block: blockJoiSchema
});

async function blockExists({ block, blockModel }: IBlockExistsParameters) {
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

export default blockExists;
