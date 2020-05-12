import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import {
  getDataFromObject,
  indexArray,
} from "../../../utilities/functionUtils";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import {
  IDirectUpdateBlockInput,
  ITaskAssigneesDiff,
  IUpdateBlockContext,
  IUpdateBlockInput,
} from "./types";
import { updateBlockJoiSchema } from "./validation";

const directUpdateFields = [
  "name",
  "description",
  "expectedEndAt",
  "color",
  "priority",
  "taskCollaborationData",
  "taskCollaborators",
  "groups",
  "projects",
  "tasks",
  "subTasks",
  "groupProjectContext",
  "groupTaskContext",
  "availableStatus",
  "availableLabels",
  "status",
  "labels",
];

const diffAssignedUsers = (
  block: IBlock,
  data: IUpdateBlockInput
): ITaskAssigneesDiff => {
  const existingTaskCollaborators = block.taskCollaborators || [];
  const incomingTaskCollaborators = data.taskCollaborators || [];
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

async function updateBlock(context: IUpdateBlockContext): Promise<void> {
  const data = validate(context.data, updateBlockJoiSchema);
  const blockData = data.data;
  const user = await context.getUser();
  const block = await context.getBlockByID(data.customId);

  canReadBlock({ user, block });

  // TODO: update only the fields available in data

  const update = getDataFromObject(
    blockData,
    directUpdateFields
  ) as IDirectUpdateBlockInput;
  const subTasks = update.subTasks;
  const now = Date.now();

  if (Array.isArray(subTasks) && subTasks.length > 0) {
    const areSubTasksCompleted = !!!subTasks.find(
      (subTask) => !!!subTask.completedAt
    );

    const taskCollaborationData =
      update.taskCollaborationData || block.taskCollaborationData;

    if (areSubTasksCompleted !== !!taskCollaborationData.completedAt) {
      // TODO: should we still keep this or find a better way to implement it?
      update.taskCollaborationData = {
        ...taskCollaborationData,
        completedAt: areSubTasksCompleted ? now : null,
        completedBy: areSubTasksCompleted ? user.customId : null,
      };
    }
  }

  await context.updateBlockByID(data.customId, update);

  // TODO: should we send an email if you're the one who assigned it to yourself?
  // TODO: how should we respect the user and not spam them? -- user settings

  const assignedUsersDiffResult = diffAssignedUsers(block, data.data);
  const newlyAssignedUsers = assignedUsersDiffResult.newAssignees;

  if (newlyAssignedUsers.length > 0) {
    const newAssignees = await context.getUsersByID(
      newlyAssignedUsers.map((assignedUser) => assignedUser.userId)
    );
    const org = await context.getBlockByID(block.rootBlockID);
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

  if (blockData.parent && block.parent !== blockData.parent) {
    const sourceBlockID = block.parent;
    const destinationBlockID = blockData.parent;
    await context.transferBlock(block, sourceBlockID, destinationBlockID);
  }
}

export default updateBlock;
