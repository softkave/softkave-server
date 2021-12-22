import { BlockType, IBlock } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { IUser } from "../../../mongo/user";
import { validate } from "../../../utilities/joiUtils";
import { IUpdateItemById } from "../../../utilities/types";
import { IBaseContext } from "../../contexts/BaseContext";
import RequestData from "../../RequestData";
import { fireAndForgetPromise } from "../../utils";
import canReadBlock from "../canReadBlock";
import { DeleteBlockEndpoint, IDeleteBlockParameters } from "./types";
import { deleteBlockJoiSchema } from "./validation";

function removeOrganizationInUser(user: IUser, organizationId: string) {
    const userOrganizationIndex = user.orgs.findIndex(
        (organization) => organization.customId === organizationId
    );
    user.orgs.splice(userOrganizationIndex, 1);
    return user;
}

async function deleteOrganizationCleanup(
    context: IBaseContext,
    instData: RequestData<IDeleteBlockParameters>,
    block: IBlock
) {
    let user = await context.session.getUser(context, instData);
    const userOrganizations = [...user.orgs];
    const userOrganizationIndex = user.orgs.findIndex(
        (organization) => organization.customId === block.customId
    );

    userOrganizations.splice(userOrganizationIndex, 1);

    // TODO: scrub user collection for unreferenced organizationIds
    user = await context.user.updateUserById(context, user.customId, {
        orgs: userOrganizations,
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
                data: { orgs: organizationUser.orgs },
            });
        }

        // notifications.push(getOrganizationDeletedNotification(block, user, organizationUser));
    });

    fireAndForgetPromise(context.user.bulkUpdateUsersById(context, updates));
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

    switch (block.type) {
        case BlockType.Organization:
            fireAndForgetPromise(
                deleteOrganizationCleanup(context, instData, block)
            );
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
