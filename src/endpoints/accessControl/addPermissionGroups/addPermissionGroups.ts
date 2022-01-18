import { SystemActionType, SystemResourceType } from "../../../models/system";
import {
    IPermissionGroup,
    IUserAssignedPermissionGroup,
} from "../../../mongo/access-control/definitions";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType, IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { getDateString, indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { IBaseContext } from "../../contexts/IBaseContext";
import {
    IOutgoingUpdateBlockPermissionGroupsPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { DuplicatePermissionGroupNameError } from "../errors";
import { IPublicPermissionGroup } from "../types";
import { assertIsPermissionBlock, getPublicPermissionGroups } from "../utils";
import {
    AddPermissionGroupsEndpoint,
    IAddPermissionsGroupParameters,
    IAddPermissionGroupsEndpointResult,
    IAddPermissionGroupsPermissionGroupInput,
    IPermissionGroupInput,
} from "./types";
import { addPermissionGroupsJoiSchema } from "./validation";

function processNewPermissionGroupsInput(
    permissionGroupInput: IPermissionGroupInput,
    user: IUser,
    block: IBlock
) {
    const permissionGroup: IPermissionGroup = {
        name: permissionGroupInput.name,
        description: permissionGroupInput.description,
        nextId: permissionGroupInput.nextId,
        prevId: permissionGroupInput.prevId,
        createdAt: getDateString(),
        createdBy: user.customId,
        customId: getNewId(),
        lowerCasedName: permissionGroupInput.name.toLowerCase(),
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
    };

    return permissionGroup;
}

export async function getIndexesWithDuplicateNames(
    context: IBaseContext,
    block: IBlock,
    names: string[]
) {
    const resourceIds: string[] = [block.customId];

    if (block.type === BlockType.Board) {
        resourceIds.push(block.rootBlockId);
    }

    const permissionGroups =
        await context.accessControl.getPermissionGroupsByLowerCasedNames(
            context,
            resourceIds,
            names
        );

    const permissionGroupNamesMap: Record<string, IPermissionGroup> =
        indexArray(permissionGroups, {
            path: "lowerCasedName",
        });

    const indexesWithDuplicateNames: number[] = [];

    names.forEach((name, i) => {
        if (name && permissionGroupNamesMap[name]) {
            indexesWithDuplicateNames.push(i);
        }
    });

    return indexesWithDuplicateNames;
}

async function throwOnDuplicateNames(
    context: IBaseContext,
    block: IBlock,
    addPermissionGroupsInput: IAddPermissionsGroupParameters["permissionGroups"]
) {
    const indexesWithDuplicateNames = await getIndexesWithDuplicateNames(
        context,
        block,
        addPermissionGroupsInput.map((input) => input.data.name.toLowerCase())
    );

    const errors = indexesWithDuplicateNames.map((index) => {
        const tempId = addPermissionGroupsInput[index].tempId;
        return new DuplicatePermissionGroupNameError({
            value: tempId,
        });
    });

    if (errors.length > 0) {
        throw errors;
    }
}

async function addPermissionGroupsToUsers(
    ctx: IBaseContext,
    block: IBlock,
    user: IUser,
    permissionGroups: (IAddPermissionGroupsPermissionGroupInput & {
        customId: string;
    })[]
) {
    const nowStr = getDateString();
    const userPermissionGroupMaps = permissionGroups.reduce(
        (data, permissionGroup) => {
            if (!permissionGroup.users) {
                return data;
            }

            return data.concat(
                permissionGroup.users.map((id) => {
                    const userPermissionGroupMap: IUserAssignedPermissionGroup =
                        {
                            userId: id,
                            organizationId: getBlockRootBlockId(block),
                            resourceId: block.customId,
                            resourceType: getBlockAuditLogResourceType(block),
                            permissionGroupId: permissionGroup.customId,
                            addedAt: nowStr,
                            addedBy: user.customId,
                            customId: getNewId(),
                        };

                    return userPermissionGroupMap;
                })
            );
        },
        [] as IUserAssignedPermissionGroup[]
    );

    if (userPermissionGroupMaps.length === 0) {
        return [];
    }

    return ctx.accessControl.saveUserAssignedPermissionGroup(
        ctx,
        userPermissionGroupMaps
    );
}

// TODO: validate next and prev permissionGroup ids that they exist in the organization/board

const addPermissionGroups: AddPermissionGroupsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, addPermissionGroupsJoiSchema);
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

    await throwOnDuplicateNames(context, block, data.permissionGroups);

    const permissionGroups: IPermissionGroup[] = [];
    const tempIdMap: Record<string, string> = {};

    data.permissionGroups.forEach((permissionGroupInput) => {
        const permissionGroup = processNewPermissionGroupsInput(
            permissionGroupInput.data,
            user,
            block
        );
        permissionGroups.push(permissionGroup);
        tempIdMap[permissionGroup.customId] = permissionGroupInput.tempId;
    });

    await context.accessControl.savePermissionGroups(context, permissionGroups);
    await addPermissionGroupsToUsers(
        context,
        block,
        user,
        permissionGroups.map((permissionGroup, i) => {
            return {
                ...permissionGroup,
                users: data.permissionGroups[i].data.users,
            };
        })
    );

    const socketOutputPermissionGroups: IPublicPermissionGroup[] = [];
    const endpointOutputPermissionGroups: IAddPermissionGroupsEndpointResult["permissionGroups"] =
        [];

    permissionGroups.forEach((permissionGroup) => {
        const outputPermissionGroup =
            getPublicPermissionGroups(permissionGroup);
        socketOutputPermissionGroups.push(outputPermissionGroup);
        endpointOutputPermissionGroups.push({
            permissionGroup: outputPermissionGroup,
            tempId: tempIdMap[permissionGroup.customId],
        });
    });

    const roomName = context.room.getBlockRoomName(block.type, block.customId);
    const updatePacket: IOutgoingUpdateBlockPermissionGroupsPacket = {
        add: socketOutputPermissionGroups,
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

    return {
        permissionGroups: endpointOutputPermissionGroups,
    };
};

export default addPermissionGroups;
