import { SystemActionType, SystemResourceType } from "../../../models/system";
import { BlockType } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId, getPublicBlocksArray } from "../utils";
import { GetBoardTasksEndpoint } from "./types";
import { getBlockChildrenJoiSchema } from "./validation";

const getBoardTasks: GetBoardTasksEndpoint = async (context, instData) => {
    const data = validate(instData.data, getBlockChildrenJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    assertBlock(board);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         orgId: getBlockRootBlockId(board),
    //         resourceType: SystemResourceType.Task,
    //         action: SystemActionType.Read,
    //         permissionResourceId: board.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: board });

    const tasks = await context.block.getBlockChildren(context, data.boardId, [
        BlockType.Task,
    ]);

    return {
        tasks: getPublicBlocksArray(tasks),
    };
};

export default getBoardTasks;
