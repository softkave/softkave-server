import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IAccessControlRole } from "../../../mongo/access-control/definitions";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType, IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { getDateString, indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { IBaseContext } from "../../contexts/BaseContext";
import {
    IOutgoingUpdateBlockRolesPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { DuplicateRoleNameError } from "../errors";
import { IPublicRoleData } from "../types";
import { assertIsPermissionBlock, getPublicRoleData } from "../utils";
import {
    AddRolesEndpoint,
    IAddRolesEndpointParameters,
    IAddRolesEndpointResult,
    IRoleInput,
} from "./types";
import { setRolesJoiSchema } from "./validation";

function processNewRoleInput(
    roleInput: IRoleInput,
    user: IUser,
    block: IBlock
) {
    const role: IAccessControlRole = {
        ...roleInput,
        createdAt: getDateString(),
        createdBy: user.customId,
        customId: getNewId(),
        lowerCasedName: roleInput.name.toLowerCase(),
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
    };

    return role;
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

    const roles = await context.accessControl.getRolesByLowerCasedNames(
        context,
        resourceIds,
        names
    );

    const roleNamesMap: Record<string, IAccessControlRole> = indexArray(roles, {
        path: "lowerCasedName",
    });

    const indexesWithDuplicateNames: number[] = [];

    names.forEach((name, i) => {
        if (name && roleNamesMap[name]) {
            indexesWithDuplicateNames.push(i);
        }
    });

    return indexesWithDuplicateNames;
}

async function throwOnDuplicateNames(
    context: IBaseContext,
    block: IBlock,
    addRolesInput: IAddRolesEndpointParameters["roles"]
) {
    const indexesWithDuplicateNames = await getIndexesWithDuplicateNames(
        context,
        block,
        addRolesInput.map((input) => input.data.name.toLowerCase())
    );

    const errors = indexesWithDuplicateNames.map((index) => {
        const tempId = addRolesInput[index].tempId;
        return new DuplicateRoleNameError({
            value: tempId,
        });
    });

    if (errors.length > 0) {
        throw errors;
    }
}

const addRoles: AddRolesEndpoint = async (context, instData) => {
    const data = validate(instData.data, setRolesJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    assertIsPermissionBlock(block);

    await context.accessControl.assertPermission(
        context,
        {
            orgId: getBlockRootBlockId(block),
            resourceType: SystemResourceType.Role,
            action: SystemActionType.Update,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    await throwOnDuplicateNames(context, block, data.roles);

    const roles: IAccessControlRole[] = [];
    const tempIdMap: Record<string, string> = {};

    data.roles.forEach((roleInput) => {
        const role = processNewRoleInput(roleInput.data, user, block);
        roles.push(role);
        tempIdMap[role.customId] = roleInput.tempId;
    });

    await context.accessControl.saveRoles(context, roles);

    const socketOutputRoles: IPublicRoleData[] = [];
    const endpointOutputRoles: IAddRolesEndpointResult["roles"] = [];

    roles.forEach((role) => {
        const outputRole = getPublicRoleData(role);
        socketOutputRoles.push(outputRole);
        endpointOutputRoles.push({
            role: outputRole,
            tempId: tempIdMap[role.customId],
        });
    });

    const roomName = context.room.getBlockRoomName(block.type, block.customId);
    const updatePacket: IOutgoingUpdateBlockRolesPacket = {
        add: socketOutputRoles,
        blockId: block.customId,
    };

    context.room.broadcast(
        context,
        roomName,
        OutgoingSocketEvents.UpdateBlockRoles,
        updatePacket,
        instData
    );

    return {
        roles: endpointOutputRoles,
    };
};

export default addRoles;
