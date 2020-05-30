import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { indexArray } from "../../../utilities/functionUtils";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import {
  ITaskAssigneesDiff,
  IUpdateBlockInput,
  UpdateBlockEndpoint,
} from "./types";
import { updateBlockJoiSchema } from "./validation";

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

const updateBlock: UpdateBlockEndpoint = async (context, instData) => {
  const data = validate(instData.data, updateBlockJoiSchema);
  const updateData = data.data;
  const user = await context.session.getUser(context.models, instData);
  const block = await context.block.getBlockById(context.models, data.customId);

  canReadBlock({ user, block });

  const parent = updateData.parent;
  delete updateData.parent;
  await context.block.updateBlockById(
    context.models,
    data.customId,
    updateData
  );

  // TODO: should we send an email if you're the one who assigned it to yourself?
  // TODO: how should we respect the user and not spam them? -- user settings

  const assignedUsersDiffResult = diffAssignedUsers(block, data.data);
  const newlyAssignedUsers = assignedUsersDiffResult.newAssignees;

  if (newlyAssignedUsers.length > 0) {
    const newAssignees = await context.user.bulkGetUsersById(
      context.models,
      newlyAssignedUsers.map((assignedUser) => assignedUser.userId)
    );
    const org = await context.block.getBlockById(
      context.models,
      block.rootBlockId
    );
    const assigneesMap = indexArray(newAssignees, { path: "customId" });

    // TODO: what should we do if any of the above calls fail?

    assignedUsersDiffResult.newAssignees.forEach((assignedUser) => {
      const assignee: IUser = assigneesMap[assignedUser.userId];

      // TODO: what else should we do if the user does not exist?
      if (assignee && assignee.customId !== user.customId) {
        context
          .sendAssignedTaskEmailNotification(
            org,
            data.data.description || block.description,
            user,
            assignee
          )
          .catch((error) => {
            console.error(error);
            // TODO: how should we handle the error?
          });
      }
    });
  }

  if (parent && block.parent !== parent) {
    await context.transferBlock(context, {
      ...instData,
      data: { destinationBlockId: parent, draggedBlockId: block.customId },
    });
  }
};

export default updateBlock;
