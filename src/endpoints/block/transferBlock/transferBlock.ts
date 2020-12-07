import { SystemActionType } from "../../../mongo/audit-log";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType, IBlock } from "../../../mongo/block";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { InvalidRequestError } from "../../errors";
import canReadBlock from "../canReadBlock";
import { BlockDoesNotExistError } from "../errors";
import { getBlockRootBlockId } from "../utils";
import { TransferBlockEndpoint } from "./types";
import { transferBlockJoiSchema } from "./validation";

const transferBlock: TransferBlockEndpoint = async (context, instData) => {
    const data = validate(instData.data, transferBlockJoiSchema);
    const blockIds = [data.draggedBlockId, data.destinationBlockId];
    const user = await context.session.getUser(context, instData);
    const blocks = await context.block.bulkGetBlocksByIds(context, blockIds);

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

    if (!destinationBlock) {
        throw new BlockDoesNotExistError({
            message: "Destination block does not exist",
        });
    }

    if (
        destinationBlock.type !== BlockType.Org &&
        destinationBlock.type !== BlockType.Board
    ) {
        throw new InvalidRequestError({
            message: "Destination block is not an org or board",
        });
    }

    if (
        draggedBlock.parent === destinationBlock.parent ||
        draggedBlock.parent === destinationBlock.customId
    ) {
        return;
    }

    const status0 = destinationBlock.boardStatuses[0];
    const draggedBlockUpdates: Partial<IBlock> = {
        updatedAt: getDate(),
        updatedBy: user.customId,
        parent: destinationBlock.customId,
        status: status0 ? status0.customId : null,
        statusAssignedAt: status0 ? getDate() : null,
        statusAssignedBy: status0 ? user.customId : null,
        labels: [],
        taskSprint: null,
        taskResolution: null,
    };

    const updatedTask = await context.block.updateBlockById(
        context,
        draggedBlock.customId,
        draggedBlockUpdates
    );

    context.broadcastHelpers.broadcastBlockUpdate(
        context,
        {
            block: draggedBlock,
            updateType: { isUpdate: true },
            data: draggedBlockUpdates,
            blockId: draggedBlock.customId,
            blockType: draggedBlock.type,
            parentId: draggedBlock.parent,
        },
        instData
    );

    context.auditLog.insert(context, instData, {
        action: SystemActionType.Transfer,
        resourceId: draggedBlock.customId,
        resourceType: getBlockAuditLogResourceType(draggedBlock),
        change: {
            customId: getNewId(),
            oldValue: { parent: draggedBlock.parent },
            newValue: { parent: destinationBlock.customId },
        },
        organizationId: getBlockRootBlockId(draggedBlock),
    });

    return {
        draggedBlock: updatedTask,
    };
};

export default transferBlock;
