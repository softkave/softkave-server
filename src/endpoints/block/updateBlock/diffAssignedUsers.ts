import { IBlock } from "../../../mongo/block";
import { indexArray } from "../../../utilities/fns";
import { ITaskAssigneesDiff, IUpdateBlockInput } from "./types";

const diffAssignedUsers = (
  block: IBlock,
  data: IUpdateBlockInput
): ITaskAssigneesDiff => {
  const existingTaskCollaborators = block.assignees || [];
  const incomingTaskCollaborators = data.assignees || [];
  const existingAssignedUsers = indexArray(existingTaskCollaborators, {
    path: "userId",
  });
  const incomingAssigendUsers = indexArray(incomingTaskCollaborators, {
    path: "userId",
  });

  const newAssignedUsers = incomingTaskCollaborators.filter((user) => {
    if (!existingAssignedUsers[user.userId]) {
      return true;
    } else {
      return false;
    }
  });

  const removedAssignedUsers = existingTaskCollaborators.filter((user) => {
    if (!incomingAssigendUsers[user.userId]) {
      return true;
    } else {
      return false;
    }
  });

  return {
    newAssignees: newAssignedUsers,
    removedAssignees: removedAssignedUsers,
  };
};

export default diffAssignedUsers;
