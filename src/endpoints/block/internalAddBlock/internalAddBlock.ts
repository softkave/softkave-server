import { IBlock } from "../../../mongo/block";
import { BlockExistsError } from "../errors";
import { InternalAddBlockEndpoint } from "./types";

const internalAddBlock: InternalAddBlockEndpoint = async (
  context,
  instData
) => {
  const user = await context.session.getUser(context.models, instData);
  const inputBlock = instData.data.block;

  if (inputBlock.type !== "task") {
    const blockExists = await context.blockExists(context, {
      ...instData,
      data: {
        name: inputBlock.name,
        type: inputBlock.type,
        parent: inputBlock.parent,
      },
    });

    if (blockExists) {
      // TODO: do a mapping of the correct error field name from called endpoints to the calling endpoints
      // TODO: error field names should not be hardcoded
      throw new BlockExistsError({
        blockType: inputBlock.type,
        field: "name",
      });
    }
  }

  const now = Date.now();
  const nowStr = now.toString();

  const block: IBlock = {
    customId: inputBlock.customId,
    name: inputBlock.name,
    lowerCasedName: inputBlock.name ? inputBlock.name.toLowerCase() : undefined,
    description: inputBlock.description,
    dueAt: inputBlock.dueAt,
    createdAt: nowStr,
    color: inputBlock.color,
    updatedAt: undefined,
    type: inputBlock.type,
    parent: inputBlock.parent,
    rootBlockId: inputBlock.rootBlockId,
    createdBy: user.customId,
    assignees: inputBlock.assignees,
    priority: inputBlock.priority,
    subTasks: inputBlock.subTasks,
    boardLabels: inputBlock.boardLabels,
    boardStatuses: inputBlock.boardStatuses,
    labels: inputBlock.labels,
    status: inputBlock.status,
    statusAssignedBy: inputBlock.statusAssignedBy,
    statusAssignedAt: inputBlock.statusAssignedAt,
  };

  const savedBlock = await context.block.saveBlock(context.models, block);

  return {
    block: savedBlock,
  };
};

export default internalAddBlock;
