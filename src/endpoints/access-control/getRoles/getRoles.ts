import { SystemActionType, SystemResourceType } from "../../../models/system";
import { validate } from "../../../utilities/joiUtils";
import accessControlGetCheck from "../accessControlGetFnsHelper";
import { getPublicRolesArray } from "../utils";
import { GetRolesEndpoint } from "./types";
import { getRolesJoiSchema } from "./validation";

const getRoles: GetRolesEndpoint = async (context, instData) => {
    const data = validate(instData.data, getRolesJoiSchema);

    const { block } = await accessControlGetCheck(
        context,
        instData,
        data.blockId,
        SystemResourceType.Role,
        SystemActionType.Read
    );

    const roles = await context.accessControl.getRolesByResourceId(
        context,
        block.customId
    );

    return { roles: getPublicRolesArray(roles) };
};

export default getRoles;
