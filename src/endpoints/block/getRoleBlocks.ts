import BlockModel from "../../mongo/block/BlockModel";
import { IUserDocument } from "../user/user";
import { getOrgIDs } from "../user/utils";

export interface IGetRoleBlocksParameters {
  user: IUserDocument;
  blockModel: BlockModel;
}

async function getRoleBlocks({ user, blockModel }: IGetRoleBlocksParameters) {
  const orgIds = getOrgIDs(user);
  const query = {
    customId: {
      $in: orgIds
    }
  };

  const blocks = await blockModel.model
    .find(query)
    .lean()
    .exec();

  return {
    blocks
  };
}

export default getRoleBlocks;
