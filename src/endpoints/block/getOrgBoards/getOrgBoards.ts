import { SystemActionType, SystemResourceType } from "../../../models/system";
import { BlockType } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId, getPublicBlocksArray } from "../utils";
import { GetOrgBoardsEndpoint } from "./types";
import { getBlockChildrenJoiSchema } from "./validation";

const getOrgBoards: GetOrgBoardsEndpoint = async (context, instData) => {
    const data = validate(instData.data, getBlockChildrenJoiSchema);
    const user = await context.session.getUser(context, instData);
    const org = await context.block.getBlockById(context, data.orgId);

    assertBlock(org);

    const boards = await context.block.getBlockChildren(context, data.orgId, [
        BlockType.Board,
    ]);

    const permissions = await context.accessControl.queryPermissions(
        context,
        getBlockRootBlockId(org),
        boards.map((b) => {
            return {
                permissionResourceId: b.permissionResourceId,
                action: SystemActionType.Read,
                resourceType: SystemResourceType.Board,
            };
        }),
        user
    );

    const permissionsMap = indexArray(permissions, {
        path: "permissionOwnerId",
    });

    const permittedBoards = boards.filter((b) => {
        return !!permissionsMap[b.permissionResourceId];
    });

    return {
        boards: getPublicBlocksArray(permittedBoards),
    };
};

export default getOrgBoards;
