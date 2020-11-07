import pick from "lodash/pick";
import { AuditLogActionType } from "../../../mongo/audit-log";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType, IBlock } from "../../../mongo/block";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { fireAndForgetPromise } from "../../utils";
import broadcastBlockUpdate from "../broadcastBlockUpdate";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId } from "../utils";
import processBoardLabelChanges from "./processBoardLabelChanges";
import processBoardResolutionsChanges from "./processBoardResolutionsChanges";
import processBoardStatusChanges from "./processBoardStatusChanges";
import sendNewlyAssignedTaskEmail from "./sendNewAssignedTaskEmail";
import { UpdateBlockEndpoint } from "./types";
import { updateBlockJoiSchema } from "./validation";

const updateBlock: UpdateBlockEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateBlockJoiSchema);
    const updateData = data.data;
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.blockId);

    canReadBlock({ user, block });

    const parent = updateData.parent;
    delete updateData.parent;

    const updatesToSave: Partial<IBlock> = {
        ...updateData,
        updatedAt: getDate(),
        updatedBy: user.customId,
    };

    if (updateData.name && block.type !== BlockType.Task) {
        updatesToSave.lowerCasedName = updateData.name.toLowerCase();
    }

    if (updateData.status && updateData.status !== block.status) {
        const assignees = updateData.assignees || block.assignees || [];

        if (assignees.length === 0) {
            assignees.push({
                userId: user.customId,
                assignedAt: getDate(),
                assignedBy: user.customId,
            });

            updatesToSave.assignees = assignees;
        }
    }

    await context.block.updateBlockById(context, data.blockId, updatesToSave);

    fireAndForgetPromise(
        broadcastBlockUpdate({
            block,
            context,
            instData,
            updateType: { isUpdate: true },
            data: updatesToSave,
            blockId: block.customId,
            blockType: block.type,
            parentId: block.parent,
        })
    );

    // TODO: should we wait for these to complete, cause a user can reload while they're pending
    //   and get incomplete/incorrect data
    fireAndForgetPromise(
        processBoardStatusChanges(context, instData, block, user)
    );

    fireAndForgetPromise(
        processBoardResolutionsChanges(context, instData, block)
    );

    fireAndForgetPromise(processBoardLabelChanges(context, instData, block));
    fireAndForgetPromise(sendNewlyAssignedTaskEmail(context, instData, block));

    context.auditLog.insert(context, instData, {
        action: AuditLogActionType.Update,
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
        change: {
            oldValue: pick(block, Object.keys(data.data)),
            newValue: data.data,
            customId: getNewId(),
        },

        // TODO: write a script to add orgId to existing update block audit logs without one
        // it was omitted prior
        organizationId: getBlockRootBlockId(block),
    });

    if (parent && block.parent !== parent) {
        await context.transferBlock(context, {
            ...instData,
            data: {
                destinationBlockId: parent,
                draggedBlockId: block.customId,
            },
        });
    }
};

export default updateBlock;
