import { IBlock } from "../../mongo/block";
import { IUser } from "../../mongo/user";

export const isUserAssignedToTask = (task: IBlock, user: IUser) => {
  const taskCollaborators = task.taskCollaborators || [];
  return !!taskCollaborators.find(
    taskCollaborator => taskCollaborator.userId === user.customId
  );
};
