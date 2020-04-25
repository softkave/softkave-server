import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { IDirectUpdateBlockInput, IUpdateBlockContext } from "./types";
import { updateBlockJoiSchema } from "./validation";

async function updateBlock(context: IUpdateBlockContext): Promise<void> {
  const data = validate(context.data, updateBlockJoiSchema);
  const blockData = data.data;
  const user = await context.getUser();
  const block = await context.getBlockByID(data.customId);

  canReadBlock({ user, block });

  // TODO: update only the fields available in data

  const update: IDirectUpdateBlockInput = {
    name: blockData.name,
    description: blockData.description,
    expectedEndAt: blockData.expectedEndAt,
    color: blockData.color,
    priority: blockData.priority,
    taskCollaborationData: blockData.taskCollaborationData,
    taskCollaborators: blockData.taskCollaborators,
    groups: blockData.groups,
    projects: blockData.projects,
    tasks: blockData.tasks,
    subTasks: blockData.subTasks,
    groupProjectContext: blockData.groupProjectContext,
    groupTaskContext: blockData.groupTaskContext,
    availableStatus: blockData.availableStatus,
    availableLabels: blockData.availableLabels,
    status: blockData.status,
    label: blockData.label,
  };

  const subTasks = update.subTasks;
  const now = Date.now();

  if (Array.isArray(subTasks) && subTasks.length > 0) {
    const areSubTasksCompleted = !!!subTasks.find(
      (subTask) => !!!subTask.completedAt
    );

    if (areSubTasksCompleted !== !!update.taskCollaborationData.completedAt) {
      // TODO: should we still keep this or find a better way to implement it?
      update.taskCollaborationData = {
        ...update.taskCollaborationData,
        completedAt: areSubTasksCompleted ? now : null,
        completedBy: areSubTasksCompleted ? user.customId : null,
      };
    }
  }

  await context.updateBlockByID(data.customId, update);

  if (block.parent !== blockData.parent) {
    const sourceBlockID = block.parent;
    const destinationBlockID = blockData.parent;
    await context.transferBlock(block, sourceBlockID, destinationBlockID);
  }
}

export default updateBlock;
