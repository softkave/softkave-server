import BlockModel from "../../mongo/block/BlockModel";
import { IUserDocument } from "../user/user";
import { blockConstants } from "./constants";

export interface IGetAssignedTasksParameters {
  user: IUserDocument;
  blockModel: BlockModel;
}

async function getAssignedTasks({
  user,
  blockModel
}: IGetAssignedTasksParameters) {
  const blocks = await blockModel.model.find({
    ["taskCollaborators.userId"]: user.customId,
    type: blockConstants.blockTypes.task
  });

  return {
    blocks
  };
}

export default getAssignedTasks;
