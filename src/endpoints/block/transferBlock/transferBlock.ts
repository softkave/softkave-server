import { IBlock } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { DraggedBlockDoesNotExistInSourceBlockError } from "../errors";
import { ITransferBlockContext } from "./types";
import { transferBlockJoiSchema } from "./validation";

async function transferBlock(context: ITransferBlockContext): Promise<void> {
  const result = validate(context.data, transferBlockJoiSchema);

  const dropPosition = result.dropPosition || 0;
  const groupContext = result.groupContext;
  const blockIDs = [result.draggedBlock, result.sourceBlock];

  if (result.destinationBlock !== result.sourceBlock) {
    blockIDs.push(result.destinationBlock);
  }

  const blocks = await context.getBlockListWithIDs(blockIDs);
  let sourceBlock: IBlock;
  let draggedBlock: IBlock;
  let destinationBlock: IBlock;
  const user = await context.getUser();

  blocks.forEach(block => {
    switch (block.customId) {
      case result.sourceBlock:
        sourceBlock = block;
        break;

      case result.draggedBlock:
        draggedBlock = block;
        break;

      case result.destinationBlock:
        destinationBlock = block;
        break;
    }
  });

  canReadBlock({ user, block: sourceBlock });

  if (result.destinationBlock !== result.sourceBlock) {
    canReadBlock({ user, block: destinationBlock });
  }

  const draggedBlockContainerName = `${draggedBlock.type}s`;
  const draggedBlockContainer: string[] =
    sourceBlock[draggedBlockContainerName];
  const draggedBlockIndexInSourceBlock = draggedBlockContainer.indexOf(
    draggedBlock.customId
  );

  if (draggedBlockIndexInSourceBlock === -1) {
    throw new DraggedBlockDoesNotExistInSourceBlockError();
  }

  if (sourceBlock.customId === destinationBlock.customId) {
    const sourceBlockUpdates: Partial<IBlock> = {};

    draggedBlockContainer.splice(draggedBlockIndexInSourceBlock, 1);
    draggedBlockContainer.splice(dropPosition, 0, draggedBlock.customId);
    sourceBlockUpdates[draggedBlockContainerName] = draggedBlockContainer;

    if (groupContext && draggedBlock.type === "group") {
      const groupContextContainerName =
        groupContext === "project" ? "groupProjectContext" : "groupTaskContext";
      const groupContextContainer = sourceBlock[groupContextContainerName];
      const draggedBlockIndexInGroupContext = groupContextContainer.indexOf(
        draggedBlock.customId
      );

      groupContextContainer.splice(draggedBlockIndexInGroupContext, 1);
      groupContextContainer.splice(dropPosition, 0, draggedBlock.customId);
      sourceBlockUpdates[groupContextContainerName] = groupContextContainer;
    }

    await context.updateBlockByID(sourceBlock.customId, sourceBlockUpdates);
  } else {
    // Ignores paremeters' groupContext and dropPosition

    const draggedBlockUpdates: Partial<IBlock> = {
      parent: destinationBlock.customId
    };

    draggedBlockContainer.splice(draggedBlockIndexInSourceBlock, 1);
    const sourceBlockUpdates: Partial<IBlock> = {
      [draggedBlockContainerName]: draggedBlockContainer
    };

    const destinationBlockContainer =
      destinationBlock[draggedBlockContainerName];
    destinationBlockContainer.splice(dropPosition, 0, draggedBlock.customId);
    const destinationBlockUpdates: Partial<IBlock> = {
      [draggedBlockContainerName]: destinationBlockContainer
    };

    await context.bulkUpdateBlocksByID([
      { id: draggedBlock.customId, data: draggedBlockUpdates },
      { id: sourceBlock.customId, data: sourceBlockUpdates },
      { id: destinationBlock.customId, data: destinationBlockUpdates }
    ]);
  }
}

export default transferBlock;
