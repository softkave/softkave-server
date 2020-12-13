import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IPermission } from "../../../mongo/access-control/definitions";
import { BlockType, IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { InvalidRequestError } from "../../errors";
import { fireAndForgetPromise } from "../../utils";
import { initializeBoardPermissions } from "../initializeBlockPermissions";
import { IPermissionInput, SetPermissionsEndpoint } from "./types";
import { setPermissionsJoiSchema } from "./validation";

interface IProcessPermissionsExtraArgs {
    user: IUser;
    block: IBlock;
}

function processUpdatePermissionInput(
    permission: Partial<IPermissionInput>,
    args: IProcessPermissionsExtraArgs
) {
    const p: Partial<IPermission> = {
        ...permission,
        updatedAt: getDate(),
        updatedBy: args.user.customId,
        available: true,
    };

    return p;
}

const setPermissions: SetPermissionsEndpoint = async (context, instData) => {
    const data = validate(instData.data, setPermissionsJoiSchema);

    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    if (block.type !== BlockType.Org && block.type !== BlockType.Board) {
        throw new InvalidRequestError();
    }

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

    if (
        block.type === BlockType.Board &&
        block.permissionResourceId !== block.customId
    ) {
        await initializeBoardPermissions(context, user, block);
    }

    const processArgs: IProcessPermissionsExtraArgs = { user, block };
    const processed = data.permissions.map((p) => {
        return {
            id: p.customId,
            data: processUpdatePermissionInput(p.data, processArgs),
        };
    });

    await context.accessControl.bulkUpdatePermissionsById(context, processed);

    fireAndForgetPromise(
        context.auditLog.insert(context, instData, {
            resourceType: SystemResourceType.Permission,
            action: SystemActionType.Update,
            organizationId: getBlockRootBlockId(block),
            resourceOwnerId: block.customId,
            userId: user.customId,
        })
    );

    return {
        permissions: processed.map((p) => {
            return {
                customId: p.id,
                updatedAt: getDateString(p.data.updatedAt),
                updatedBy: p.data.updatedBy,
            };
        }),
    };
};

export default setPermissions;
