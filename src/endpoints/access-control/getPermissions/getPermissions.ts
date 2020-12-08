import { SystemActionType, SystemResourceType } from "../../../models/system";
import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { InvalidRequestError } from "../../errors";
import { getPublicPermissionsArray } from "../utils";
import { GetPermissionsEndpoint } from "./types";
import { getPermissionsJoiSchema } from "./validation";

const getPermissions: GetPermissionsEndpoint = async (context, instData) => {
    const data = validate(instData.data, getPermissionsJoiSchema);
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
            action: SystemActionType.Read,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    const permissions = await context.accessControl.getPermissionsByResourceId(
        context,
        block.customId
    );

    return {
        permissions: getPublicPermissionsArray(permissions),
    };
};

export default getPermissions;
