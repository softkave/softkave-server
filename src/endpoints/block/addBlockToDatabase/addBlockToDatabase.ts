import { IBlock } from "../../../mongo/block";
import { BlockExistsError } from "../errors";
import { IAddBlockToDatabaseContext, IAddBlockToDatabaseResult } from "./types";

async function addBlockToDatabase(
  context: IAddBlockToDatabaseContext
): Promise<IAddBlockToDatabaseResult> {
  const user = await context.getUser();
  const inputBlock = context.data.block;

  if (inputBlock.type !== "task") {
    if (await context.doesBlockExist(inputBlock)) {
      // TODO: do a mapping of the correct error field name from called endpoints
      //    to the calling endpoints
      // TODO: error field names should not be hardcoded
      throw new BlockExistsError({
        blockType: inputBlock.type,
        field: "name",
      });
    }
  }

  const subTasks = inputBlock.subTasks;
  const now = Date.now();

  // Adding other information to sub-tasks
  if (Array.isArray(subTasks) && subTasks.length > 0) {
    const areSubTasksCompleted = !!!subTasks.find(
      (subTask) => !!!subTask.completedAt
    );

    if (
      areSubTasksCompleted !== !!inputBlock.taskCollaborationData.completedAt
    ) {
      inputBlock.taskCollaborationData = {
        ...inputBlock.taskCollaborationData,
        completedAt: areSubTasksCompleted ? now : null,
        completedBy: areSubTasksCompleted ? user.customId : null,
      };
    }
  }

  const block: IBlock = {
    customId: inputBlock.customId,
    name: inputBlock.name,
    lowerCasedName: inputBlock.name ? inputBlock.name.toLowerCase() : undefined,
    description: inputBlock.description,
    expectedEndAt: inputBlock.expectedEndAt,
    createdAt: now,
    color: inputBlock.color,
    updatedAt: undefined,
    type: inputBlock.type,
    parent: inputBlock.parent,
    rootBlockID: inputBlock.rootBlockID,
    createdBy: user.customId,
    taskCollaborationData: inputBlock.taskCollaborationData,
    taskCollaborators: inputBlock.taskCollaborators,
    priority: inputBlock.priority,
    tasks: inputBlock.tasks,
    groups: inputBlock.groups,
    projects: inputBlock.projects,
    groupTaskContext: inputBlock.groupTaskContext,
    groupProjectContext: inputBlock.groupProjectContext,
    subTasks: inputBlock.subTasks,
    boardId: inputBlock.boardId,
    availableLabels: inputBlock.availableLabels,
    availableStatus: inputBlock.availableStatus,
    labels: inputBlock.labels,
    status: inputBlock.status,
  };

  const savedBlock = await context.saveBlock(block);

  return {
    block: savedBlock,
  };
}

export default addBlockToDatabase;
