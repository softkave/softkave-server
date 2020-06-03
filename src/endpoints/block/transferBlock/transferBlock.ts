import { AuditLogActionType } from "../../../mongo/audit-log";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { IBlock } from "../../../mongo/block";
import { getDate } from "../../../utilities/fns";
import getId from "../../../utilities/getId";
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
    updatedAt: getDate(),
    parent: destinationBlock.customId,
  };

  await context.block.updateBlockById(
    context.models,
    draggedBlock.customId,
    draggedBlockUpdates
  );

  context.auditLog.insert(context.models, instData, {
    action: AuditLogActionType.Transfer,
    resourceId: draggedBlock.customId,
    resourceType: getBlockAuditLogResourceType(draggedBlock),
    change: {
      customId: getId(),
      oldValue: { parent: draggedBlock.parent },
      newValue: { parent: destinationBlock.customId },
    },
    organizationId: draggedBlock.rootBlockId,
  });
};

export default transferBlock;
