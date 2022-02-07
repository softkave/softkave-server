import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IPermissionGroup } from "../../../mongo/access-control/definitions";
import { IBlock } from "../../../mongo/block";
import { indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { IUpdateItemById } from "../../../utilities/types";
import { getBlockRootBlockId } from "../../block/utils";
import { IBaseContext } from "../../contexts/IBaseContext";
import {
    IOutgoingUpdateBlockPermissionGroupsPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { assertIsPermissionBlock } from "../utils";
import { DeletePermissionGroupsEndpoint } from "./types";
import { deletePermissionGroupsJoiSchema } from "./validation";

async function relinkPermissionGroups(
    ctx: IBaseContext,
    block: IBlock,
    permissionGroupIds: string[]
) {
    const permissionGroupIdsMap = indexArray(permissionGroupIds);
    const permissionGroups =
        await ctx.accessControl.getPermissionGroupsByResourceId(
            ctx,
            block.customId
        );

    const updates: Array<IUpdateItemById<IPermissionGroup>> = permissionGroups
        .filter(
            (permissionGroup) =>
                !!permissionGroupIdsMap[permissionGroup.customId]
        )
        .map((permissionGroup, i) => {
            const prevPermissionGroup = permissionGroups[i - 1];
            const nextPermissionGroup = permissionGroups[i + 1];
            const update: Partial<IPermissionGroup> = {};

            if (prevPermissionGroup) {
                update.prevId = prevPermissionGroup.customId;
            } else {
                update.prevId = null;
            }

            if (nextPermissionGroup) {
                update.nextId = nextPermissionGroup.customId;
            } else {
                update.nextId = null;
            }

            return {
                id: permissionGroup.customId,
                data: update,
            };
        });

    await ctx.accessControl.bulkUpdatePermissionGroupsById(ctx, updates);
}

const deletePermissionGroups: DeletePermissionGroupsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, deletePermissionGroupsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    assertIsPermissionBlock(block);
    await context.accessControl.assertPermission(
        context,
        {
            organizationId: getBlockRootBlockId(block),
            resourceType: SystemResourceType.Permission,
            action: SystemActionType.Update,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    await relinkPermissionGroups(context, block, data.permissionGroups);
    await context.accessControl.deletePermissionGroups(
        context,
        data.permissionGroups
    );
    await context.accessControl.deleteUserAssignedPermissionGroupsByPermissionGroupId(
        context,
        data.permissionGroups
    );

    const roomName = context.room.getBlockRoomName(block.type, block.customId);
    const updatePacket: IOutgoingUpdateBlockPermissionGroupsPacket = {
        remove: data.permissionGroups,
        blockId: block.customId,
    };

    context.room.broadcast(
        context,
        instData,
        roomName,
        OutgoingSocketEvents.UpdateBlockPermissionGroups,
        updatePacket,
        true
    );
};

export default deletePermissionGroups;
