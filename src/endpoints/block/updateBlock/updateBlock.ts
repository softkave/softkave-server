import { validate } from "utils/joiUtils";
import { IDirectUpdateBlockInput, IUpdateBlockContext } from "./types";
import { updateBlockJoiSchema } from "./validation";

async function updateBlock(context: IUpdateBlockContext): Promise<void> {
  const data = validate(context.data, updateBlockJoiSchema);
  const blockData = data.data;
  const user = await context.getUser();
  const block = await context.getBlockByID(data.blockID);

  // TODO: do access control check in all the endpoints

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
    subTasks: blockData.subTasks
  };

  const subTasks = update.subTasks;
  const now = Date.now();

  if (Array.isArray(subTasks) && subTasks.length > 0) {
    const areSubTasksCompleted = !!!subTasks.find(
      subTask => !!!subTask.completedAt
    );

    if (areSubTasksCompleted !== !!update.taskCollaborationData.completedAt) {
      // TODO: should we still keep this or find a better way to implement it?
      update.taskCollaborationData = {
        ...update.taskCollaborationData,
        completedAt: areSubTasksCompleted ? now : null,
        completedBy: areSubTasksCompleted ? user.customId : null
      };
    }
  }

  await context.updateBlock(data.blockID, update);

  if (hasBlockParentsChanged(block, update)) {
    await context.transferBlock(block);

    await transferBlock({
      accessControlModel,
      user,
      blockModel,
      draggedBlock: block,
      sourceBlock: { customId: getImmediateParentID(block) },
      destinationBlock: { customId: getImmediateParentID(update as IBlock) },
      draggedBlockType: block.type
    });
  }
}

export default updateBlock;