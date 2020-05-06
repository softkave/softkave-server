import { getDataFromObject } from "../../../utilities/functionUtils";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { IDirectUpdateBlockInput, IUpdateBlockContext } from "./types";
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

  if (blockData.parent && block.parent !== blockData.parent) {
    const sourceBlockID = block.parent;
    const destinationBlockID = blockData.parent;
    await context.transferBlock(block, sourceBlockID, destinationBlockID);
  }
}

export default updateBlock;
