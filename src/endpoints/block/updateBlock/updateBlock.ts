import pick from "lodash/pick";
import { SystemActionType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { assertBlock } from "../../../mongo/block/utils";
import { indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { fireAndForgetPromise } from "../../utils";
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

    assertBlock(block);
    await context.accessControl.assertPermission(
        context,
        {
            orgId: getBlockRootBlockId(block),
            resourceType: getBlockAuditLogResourceType(block),
            action: SystemActionType.Update,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    const parentInput = updateData.parent;

    // Parent update ( tranferring block ) is handled separately by transferBlock
    delete updateData.parent;

    const update = processUpdateBlockInput(block, updateData, user);

    if (update.assignees?.length > 0) {
        const users = await context.user.bulkGetUsersById(
            context,
            update.assignees.map((a) => a.userId)
        );

        const usersMap = indexArray(users, { path: "customId" });
        update.assignees = update.assignees.filter((a) => {
            const assigneeUserData = usersMap[a.userId];

            if (!assigneeUserData) {
                return false;
            }

            const isUserInOrg = !!assigneeUserData.orgs.find(
                (o) => o.customId === block.rootBlockId
            );

            return isUserInOrg;
        });
    }

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
        sendNewlyAssignedTaskEmail(
            context,
            instData,
            block,
            update,
            updatedBlock
        )
    );

    context.auditLog.insert(context, instData, {
        action: SystemActionType.Update,
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

    if (parentInput && block.parent !== parentInput) {
        const result = await context.transferBlock(context, {
            ...instData,
            data: {
                destinationBlockId: parentInput,
                draggedBlockId: block.customId,
            },
        });

        updatedBlock = result.draggedBlock;
    }

    return { block: getPublicBlockData(updatedBlock) };
};

export default updateBlock;
