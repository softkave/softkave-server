import { SystemActionType, SystemResourceType } from "../../../models/system";
import {
    DefaultPermissionGroupNames,
    IPermissionGroup,
    IUserAssignedPermissionGroup,
} from "../../../mongo/access-control/definitions";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { IBlock } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { IUser } from "../../../mongo/user";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { IBaseContext } from "../../contexts/BaseContext";
import {
    IOutgoingUpdateBlockPermissionGroupsPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { getIndexesWithDuplicateNames } from "../addPermissionGroups/addPermissionGroups";
import { IPermissionGroupInput } from "../addPermissionGroups/types";
import { DuplicatePermissionGroupNameError } from "../errors";
import { assertIsPermissionBlock } from "../utils";
import {
    IUpdatePermissionGroupsParameters,
    UpdatePermissionGroupsEndpoint,
} from "./types";
import { updatePermissionGroupInputJoiSchema } from "./validation";

function processUpdatePermissionGroupInput(
    permissionGroupInput: Partial<IPermissionGroupInput>,
    user: IUser
) {
    const permissionGroup: Partial<IPermissionGroup> = {
        ...permissionGroupInput,
        updatedAt: getDateString(),
        updatedBy: user.customId,
    };

    return permissionGroup;
}

async function throwOnDuplicateNames(
    context: IBaseContext,
    block: IBlock,
    updatePermissionGroupsInput: IUpdatePermissionGroupsParameters["permissionGroups"]
) {
    const indexesWithDuplicateNames = await getIndexesWithDuplicateNames(
        context,
        block,
        updatePermissionGroupsInput
            .filter(
                (input) =>
                    !!input.data.name &&
                    input.customId !== block.publicPermissionGroupId
            )
            .map((input) => input.data.name.toLowerCase())
    );

    const errors = indexesWithDuplicateNames.map((index) => {
        const customId = updatePermissionGroupsInput[index].customId;
        return new DuplicatePermissionGroupNameError({
            value: customId,
        });
    });

    if (errors.length > 0) {
        throw errors;
    }
}

async function updateUserPermissionGroupMaps(
    ctx: IBaseContext,
    block: IBlock,
    user: IUser,
    permissionGroups: IUpdatePermissionGroupsParameters["permissionGroups"]
) {
    const nowStr = getDateString();
    let add: IUserAssignedPermissionGroup[] = [];
    let remove: Array<{ userIds: string[]; permissionGroupId: string }> = [];

    permissionGroups.forEach((permissionGroup) => {
        if (permissionGroup.data?.users?.add) {
            add = add.concat(
                permissionGroup.data.users.add.map((id) => {
                    const userPermissionGroupMap: IUserAssignedPermissionGroup = {
                        userId: id,
                        orgId: getBlockRootBlockId(block),
                        resourceId: block.customId,
                        resourceType: getBlockAuditLogResourceType(block),
                        permissionGroupId: permissionGroup.customId,
                        addedAt: nowStr,
                        addedBy: user.customId,
                    };

                    return userPermissionGroupMap;
                })
            );
        }

        if (permissionGroup.data?.users?.remove) {
            remove.push({
                permissionGroupId: permissionGroup.customId,
                userIds: permissionGroup.data.users.remove,
            });
        }
    });

    if (add.length > 0) {
        await ctx.accessControl.saveUserAssignedPermissionGroup(ctx, add);
    }

    if (remove.length > 0) {
        await ctx.accessControl.deleteUserAssignedPermissionGroupsByUserAndPermissionGroupIds(
            ctx,
            remove
        );
    }
}

// TODO: what if the client screws up the prev and next permissionGroup ids

const updatePermissionGroups: UpdatePermissionGroupsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, updatePermissionGroupInputJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    assertBlock(block);
    assertIsPermissionBlock(block);

    await context.accessControl.assertPermission(
        context,
        {
            orgId: getBlockRootBlockId(block),
            resourceType: SystemResourceType.Permission,
            action: SystemActionType.Update,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    await throwOnDuplicateNames(context, block, data.permissionGroups);

    const permissionGroupsUpdate = data.permissionGroups.map(
        (permissionGroupInput) => {
            const isPublicPermissionGroup =
                permissionGroupInput.customId === block.publicPermissionGroupId;

            if (isPublicPermissionGroup && permissionGroupInput.data.name) {
                permissionGroupInput.data.name = DefaultPermissionGroupNames.Public.toLowerCase();
            }

            return {
                id: permissionGroupInput.customId,
                data: processUpdatePermissionGroupInput(
                    permissionGroupInput.data,
                    user
                ),
            };
        }
    );

    await context.accessControl.bulkUpdatePermissionGroupsById(
        context,
        permissionGroupsUpdate
    );
    await updateUserPermissionGroupMaps(
        context,
        block,
        user,
        data.permissionGroups
    );

    const roomName = context.room.getBlockRoomName(block.type, block.customId);
    const updatePacket: IOutgoingUpdateBlockPermissionGroupsPacket = {
        update: permissionGroupsUpdate,
        blockId: block.customId,
    };

    context.room.broadcast(
        context,
        roomName,
        OutgoingSocketEvents.UpdateBlockPermissionGroups,
        updatePacket,
        instData
    );

    return {
        permissionGroups: permissionGroupsUpdate.map((input) => {
            return {
                customId: input.id,
                updatedAt: input.data.updatedAt,
                updatedBy: input.data.updatedBy,
            };
        }),
    };
};

export default updatePermissionGroups;
