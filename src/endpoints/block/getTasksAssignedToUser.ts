import BlockModel from "../../mongo/block/BlockModel";
import { IUserDocument } from "../user/user";
import { blockConstants } from "./constants";

export interface IGetBlocksAssignedToUserParameters {
  user: IUserDocument;
  blockModel: BlockModel;
}

async function getTasksAssignedToUser({
  user,
  blockModel
}: IGetBlocksAssignedToUserParameters) {
  const blocks = await blockModel.model.find({
    ["taskCollaborators.userId"]: user.customId,
    type: blockConstants.blockTypes.task
  });

  return {
    blocks
  };
}

export default getTasksAssignedToUser;
