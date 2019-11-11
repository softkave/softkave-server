import { IBlock } from "../../../mongo/block";
import BlockModel from "../../../mongo/block/BlockModel";

export interface IGetBlocksWithCustomIDsDataProvider {
  getBlocksWithCustomIDs: (
    ids: string[],
    userOrgIDs: string[]
  ) => Promise<IBlock[]>;
}

export default class GetBlocksWithCustomIDsDataProvider
  implements IGetBlocksWithCustomIDsDataProvider {
  private blockModel: BlockModel;

  constructor(blockModel: BlockModel) {
    this.blockModel = blockModel;
  }

  public async getBlocksWithCustomIDs(ids: string[], userOrgIDs: string[]) {
    const query = {
      customId: { $in: ids },
      parents: { $in: userOrgIDs }
    };

    const blocks = await this.blockModel.model.find(query).exec();

    return blocks;
  }
}
