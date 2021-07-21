import { SystemActionType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType, IBlock } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { INotification } from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import { validate } from "../../../utilities/joiUtils";
import { IUpdateItemById } from "../../../utilities/types";
import { IBaseContext } from "../../contexts/BaseContext";
import { getOrganizationDeletedNotification } from "../../notifications/templates/organization";
import RequestData from "../../RequestData";
import { fireAndForganizationetPromise } from "../../utils";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId } from "../utils";
import { DeleteBlockEndpoint, IDeleteBlockParameters } from "./types";
import { deleteBlockJoiSchema } from "./validation";

function removeOrganizationInUser(user: IUser, organizationId: string) {
    const userOrganizationIndex = user.organizations.findIndex(
        (organization) => organization.customId === organizationId
    );
    user.organizations.splice(userOrganizationIndex, 1);
    return user;
}

async function deleteOrganizationCleanup(
    context: IBaseContext,
    instData: RequestData<IDeleteBlockParameters>,
    block: IBlock
) {
    let user = await context.session.getUser(context, instData);
    const userOrganizations = [...user.organizations];
    const userOrganizationIndex = user.organizations.findIndex(
        (organization) => organization.customId === block.customId
    );

    userOrganizations.splice(userOrganizationIndex, 1);

    // TODO: scrub user collection for unreferenced organizationIds
    user = await context.user.updateUserById(context, user.customId, {
        organizations: userOrganizations,
    });

    instData.user = user;
    const organizationUsers = await context.user.getOrganizationUsers(
        context,
        block.customId
    );
    // const notifications: INotification[] = [];
    const updates: Array<IUpdateItemById<IUser>> = [];

    organizationUsers.forEach((organizationUser) => {
        if (organizationUser.customId !== user.customId) {
            removeOrganizationInUser(organizationUser, block.customId);
            updates.push({
                id: organizationUser.customId,
                data: { organizations: organizationUser.organizations },
            });
        }

        // notifications.push(getOrganizationDeletedNotification(block, user, organizationUser));
    });

    fireAndForganizationetPromise(
        context.user.bulkUpdateUsersById(context, updates)
    );
    // fireAndForganizationetPromise(
    //     context.notification.bulkSaveNotifications(context, notifications)
    // );

    // TODO: delete permissions
    // TODO: delete permissionGroups
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
    // TODO: delete permissionGroups
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
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         organizationId: getBlockRootBlockId(block),
    //         resourceType: getBlockAuditLogResourceType(block),
    //         action: SystemActionType.Delete,
    //         permissionResourceId: block.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block });

    await context.block.deleteBlockAndChildren(context, block.customId);

    context.broadcastHelpers.broadcastBlockUpdate(context, instData, {
        block,
        updateType: { isDelete: true },
        blockId: block.customId,
        blockType: block.type,
        parentId: block.parent,
    });

    context.auditLog.insert(context, instData, {
        action: SystemActionType.Delete,
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
        organizationId: getBlockRootBlockId(block),
    });

    switch (block.type) {
        case BlockType.Organization:
            fireAndForganizationetPromise(
                deleteOrganizationCleanup(context, instData, block)
            );
            break;

        case BlockType.Board:
            fireAndForganizationetPromise(
                deleteBoardCleanup(context, instData, block)
            );
            break;

        case BlockType.Task:
            fireAndForganizationetPromise(
                deleteTaskCleanup(context, instData, block)
            );
            break;
    }
};

export default deleteBlock;
