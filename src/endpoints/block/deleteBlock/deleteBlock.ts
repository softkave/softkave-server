import { SystemActionType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType, IBlock } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { INotification } from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import { validate } from "../../../utilities/joiUtils";
import { IUpdateItemById } from "../../../utilities/types";
import { IBaseContext } from "../../contexts/BaseContext";
import { getOrgDeletedNotification } from "../../notifications/templates/org";
import RequestData from "../../RequestData";
import { fireAndForgetPromise } from "../../utils";
import { getBlockRootBlockId } from "../utils";
import { DeleteBlockEndpoint, IDeleteBlockParameters } from "./types";
import { deleteBlockJoiSchema } from "./validation";

function removeOrgInUser(user: IUser, orgId: string) {
    const userOrgIndex = user.orgs.findIndex((org) => org.customId === orgId);
    user.orgs.splice(userOrgIndex, 1);
    return user;
}

async function deleteOrgCleanup(
    context: IBaseContext,
    instData: RequestData<IDeleteBlockParameters>,
    block: IBlock
) {
    const user = await context.session.getUser(context, instData);
    const userOrgs = [...user.orgs];
    const userOrgIndex = user.orgs.findIndex(
        (org) => org.customId === block.customId
    );

    userOrgs.splice(userOrgIndex, 1);

    // TODO: scrub user collection for unreferenced orgIds
    await context.session.updateUser(context, instData, {
        orgs: userOrgs,
    });

    const orgUsers = await context.user.getOrgUsers(context, block.customId);
    const notifications: INotification[] = [];
    const updates: Array<IUpdateItemById<IUser>> = [];

    orgUsers.forEach((orgUser) => {
        if (orgUser.customId !== user.customId) {
            removeOrgInUser(orgUser, block.customId);
            updates.push({
                id: orgUser.customId,
                data: { orgs: orgUser.orgs },
            });
        }

        notifications.push(getOrgDeletedNotification(block, user, orgUser));
    });

    fireAndForgetPromise(context.user.bulkUpdateUsersById(context, updates));
    fireAndForgetPromise(
        context.notification.bulkSaveNotifications(context, notifications)
    );

    // TODO: delete permissions
    // TODO: delete roles
    // TODO: delete notifications
    // TODO: delete notes
    // TODO: delete sprints
    // TODO: delete comments
    // TODO: delete rooms
    // TODO: delete chats
    // TODO: delete collaboration requests
    // TODO: delete notification subscriptions
}

async function deleteBoardCleanup(
    context: IBaseContext,
    instData: RequestData<IDeleteBlockParameters>,
    block: IBlock
) {
    // TODO: delete permissions
    // TODO: delete roles
    // TODO: delete notes
    // TODO: delete sprints
    // TODO: delete comments
    // TODO: delete notification subscriptions
}

async function deleteTaskCleanup(
    context: IBaseContext,
    instData: RequestData<IDeleteBlockParameters>,
    block: IBlock
) {
    // TODO: delete notes
    // TODO: delete comments
    // TODO: delete notification subscriptions
}

const deleteBlock: DeleteBlockEndpoint = async (context, instData) => {
    const data = validate(instData.data, deleteBlockJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.blockId);

    assertBlock(block);
    await context.accessControl.assertPermission(
        context,
        getBlockRootBlockId(block),
        {
            resourceType: getBlockAuditLogResourceType(block),
            action: SystemActionType.Delete,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    await context.block.deleteBlock(context, block.customId);

    context.broadcastHelpers.broadcastBlockUpdate(
        context,
        {
            block,
            updateType: { isDelete: true },
            blockId: block.customId,
            blockType: block.type,
            parentId: block.parent,
        },
        instData
    );

    context.auditLog.insert(context, instData, {
        action: SystemActionType.Delete,
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
        organizationId: getBlockRootBlockId(block),
    });

    switch (block.type) {
        case BlockType.Org:
            fireAndForgetPromise(deleteOrgCleanup(context, instData, block));
            break;

        case BlockType.Board:
            fireAndForgetPromise(deleteBoardCleanup(context, instData, block));
            break;

        case BlockType.Task:
            fireAndForgetPromise(deleteTaskCleanup(context, instData, block));
            break;
    }
};

export default deleteBlock;
