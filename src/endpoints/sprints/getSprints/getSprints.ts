import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import { getPublicSprintArray } from "../utils";
import { GetSprintsEndpoint } from "./types";
import { getSprintsJoiSchema } from "./validation";

const getSprints: GetSprintsEndpoint = async (context, instData) => {
    const data = validate(instData.data, getSprintsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    assertBlock(board);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         organizationId: getBlockRootBlockId(board),
    //         resourceType: SystemResourceType.Board,
    //         action: SystemActionType.Read,
    //         permissionResourceId: board.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: board });

    const sprints = await context.sprint.getSprintsByBoardId(
        context,
        board.customId
    );

    return { sprints: getPublicSprintArray(sprints) };
};

export default getSprints;
