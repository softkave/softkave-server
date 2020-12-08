import { SystemActionType, SystemResourceType } from "../../../models/system";
import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { InvalidRequestError } from "../../errors";
import { getPublicRolesArray } from "../utils";
import { GetRolesEndpoint } from "./types";
import { getRolesJoiSchema } from "./validation";

const getRoles: GetRolesEndpoint = async (context, instData) => {
    const data = validate(instData.data, getRolesJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    if (block.type !== BlockType.Org && block.type !== BlockType.Board) {
        throw new InvalidRequestError();
    }

    await context.accessControl.assertPermission(
        context,
        {
            orgId: getBlockRootBlockId(block),
            resourceType: SystemResourceType.Role,
            action: SystemActionType.Read,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    const roles = await context.accessControl.getRolesByResourceId(
        context,
        block.customId
    );

    return { roles: getPublicRolesArray(roles) };
};

export default getRoles;
