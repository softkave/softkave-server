import BlockModel from "../../mongo/block/BlockModel";
import { IBlock } from "./block";

export interface IBlockExistsParameters {
  block: IBlock;
  blockModel: BlockModel;
}

async function blockExists({ block, blockModel }: IBlockExistsParameters) {
  const { name, type, customId, parents } = block;
  const blockExistQuery: any = {
    name,
    type,
    customId
  };

  if (parents) {
    blockExistQuery.parents = parents;
  }

  const blockExistsResult = await blockModel.model
    .findOne(blockExistQuery, "customId")
    .exec();

  return blockExistsResult;
}

export default blockExists;
