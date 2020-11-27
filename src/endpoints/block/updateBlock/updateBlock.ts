import pick from "lodash/pick";
import { AuditLogActionType } from "../../../mongo/audit-log";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { fireAndForgetPromise } from "../../utils";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId, getPublicBlockData } from "../utils";
import persistBoardLabelChanges from "./persistBoardLabelChanges";
import persistBoardResolutionsChanges from "./persistBoardResolutionsChanges";
import persistBoardStatusChanges from "./persistBoardStatusChanges";
import processUpdateBlockInput from "./processUpdateBlockInput";
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

    // Parent update ( tranferring block ) is handled separately by transferBlock
    delete updateData.parent;

    const update = processUpdateBlockInput(block, updateData, user);

    let updatedBlock = await context.block.updateBlockById(
        context,
        data.blockId,
        update
    );

    context.broadcastHelpers.broadcastBlockUpdate(
        context,
        {
            block,
            updateType: { isUpdate: true },
            data: update,
            blockId: block.customId,
            blockType: block.type,
            parentId: block.parent,
        },
        instData
    );

    // TODO: should we wait for these to complete, cause a user can reload while they're pending
    // and get incomplete/incorrect data
    fireAndForgetPromise(
        persistBoardStatusChanges(context, instData, block, update, user)
    );
    fireAndForgetPromise(
        persistBoardResolutionsChanges(context, instData, block, update)
    );
    fireAndForgetPromise(
        persistBoardLabelChanges(context, instData, block, update)
    );
    fireAndForgetPromise(
        sendNewlyAssignedTaskEmail(context, instData, block, update)
    );

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
        const result = await context.transferBlock(context, {
            ...instData,
            data: {
                destinationBlockId: parent,
                draggedBlockId: block.customId,
            },
        });

        updatedBlock = result.draggedBlock;
    }

    return { block: getPublicBlockData(updatedBlock) };
};

export default updateBlock;
