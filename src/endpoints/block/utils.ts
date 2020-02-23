import { IBlock } from "../../mongo/block";
import { IUser } from "../../mongo/user";

export const isUserAssignedToTask = (task: IBlock, user: IUser) => {
  const taskCollaborators = task.taskCollaborators || [];
  return !!taskCollaborators.find(
    taskCollaborator => taskCollaborator.userId === user.customId
  );
};

export function getImmediateParentID(parents?: string[]) {
  if (Array.isArray(parents)) {
    return parents[parents.length - 1];
  }
}

export function getRootBlockID(parents?: string[]) {
  if (Array.isArray(parents)) {
    return parents[0];
  }
}
