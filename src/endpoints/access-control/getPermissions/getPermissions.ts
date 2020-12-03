import { SystemActionType, SystemResourceType } from "../../../models/system";
import { validate } from "../../../utilities/joiUtils";
import accessControlGetCheck from "../accessControlGetFnsHelper";
import { getPublicPermissionsArray } from "../utils";
import { GetPermissionsEndpoint } from "./types";
import { getPermissionsJoiSchema } from "./validation";

const getPermissions: GetPermissionsEndpoint = async (context, instData) => {
    const data = validate(instData.data, getPermissionsJoiSchema);

    const { block } = await accessControlGetCheck(
        context,
        instData,
        data.blockId,
        SystemResourceType.Permission,
        SystemActionType.Read
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
