import { IBlock } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { TransferBlockEndpoint } from "./types";
import { transferBlockJoiSchema } from "./validation";

const transferBlock: TransferBlockEndpoint = async (context, instData) => {
  const data = validate(instData.data, transferBlockJoiSchema);
  const blockIds = [data.draggedBlockId, data.destinationBlockId];
  const user = await context.session.getUser(context.models, instData);
  const blocks = await context.block.bulkGetBlocksByIds(
    context.models,
    blockIds
  );

  let draggedBlock: IBlock;
  let destinationBlock: IBlock;

  blocks.forEach((block) => {
    switch (block.customId) {
      case data.draggedBlockId:
        draggedBlock = block;
        break;

      case data.destinationBlockId:
        destinationBlock = block;
        break;
    }
  });

  canReadBlock({ user, block: draggedBlock });

  if (draggedBlock.parent === destinationBlock.parent) {
    return;
  }

  const draggedBlockUpdates: Partial<IBlock> = {
    updatedAt: new Date().toString(),
    parent: destinationBlock.customId,
  };

  await context.block.updateBlockById(
    context.models,
    draggedBlock.customId,
    draggedBlockUpdates
  );
};

export default transferBlock;
