import { SystemActionType, SystemResourceType } from "../../../models/system";
import {
    AccessControlDefaultRoles,
    IAccessControlRole,
} from "../../../mongo/access-control/definitions";
import { IBlock } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { IUser } from "../../../mongo/user";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { IBaseContext } from "../../contexts/BaseContext";
import {
    IOutgoingUpdateBlockRolesPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { getIndexesWithDuplicateNames } from "../addRoles/addRoles";
import { IRoleInput } from "../addRoles/types";
import { DuplicateRoleNameError } from "../errors";
import { assertIsPermissionBlock } from "../utils";
import { IUpdateRolesEndpointParameters, UpdateRolesEndpoint } from "./types";
import { setRolesJoiSchema } from "./validation";

function processUpdateRoleInput(roleInput: Partial<IRoleInput>, user: IUser) {
    const role: Partial<IAccessControlRole> = {
        ...roleInput,
        updatedAt: getDateString(),
        updatedBy: user.customId,
    };

    return role;
}

async function throwOnDuplicateNames(
    context: IBaseContext,
    block: IBlock,
    updateRolesInput: IUpdateRolesEndpointParameters["roles"]
) {
    const indexesWithDuplicateNames = await getIndexesWithDuplicateNames(
        context,
        block,
        updateRolesInput
            .filter(
                (input) =>
                    !!input.data.name && input.customId !== block.publicRoleId
            )
            .map((input) => input.data.name.toLowerCase())
    );

    const errors = indexesWithDuplicateNames.map((index) => {
        const customId = updateRolesInput[index].customId;
        return new DuplicateRoleNameError({
            value: customId,
        });
    });

    if (errors.length > 0) {
        throw errors;
    }
}

// TODO: what if the client screws up the prev and next role ids

const updateRoles: UpdateRolesEndpoint = async (context, instData) => {
    const data = validate(instData.data, setRolesJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    assertBlock(block);
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

    const rolesUpdate = data.roles.map((roleInput) => {
        const isPublicRole = roleInput.customId === block.publicRoleId;

        if (isPublicRole && roleInput.data.name) {
            roleInput.data.name = AccessControlDefaultRoles.Public.toLowerCase();
        }

        return {
            id: roleInput.customId,
            data: processUpdateRoleInput(roleInput.data, user),
        };
    });

    await context.accessControl.bulkUpdateRolesById(context, rolesUpdate);

    const roomName = context.room.getBlockRoomName(block.type, block.customId);
    const updatePacket: IOutgoingUpdateBlockRolesPacket = {
        update: rolesUpdate,
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
        roles: rolesUpdate.map((input) => {
            return {
                customId: input.id,
                updatedAt: input.data.updatedAt,
                updatedBy: input.data.updatedBy,
            };
        }),
    };
};

export default updateRoles;
