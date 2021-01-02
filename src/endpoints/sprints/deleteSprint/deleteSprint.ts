import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IBlock } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { ISprint } from "../../../mongo/sprint";
import { validate } from "../../../utilities/joiUtils";
import { IUpdateItemById } from "../../../utilities/types";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import {
    CannotDeleteCurrentOrPastSprintError,
    SprintDoesNotExistError,
} from "../errors";
import { DeleteSprintEndpoint } from "./types";
import { deleteSprintJoiSchema } from "./validation";

const deleteSprint: DeleteSprintEndpoint = async (context, instData) => {
    const data = validate(instData.data, deleteSprintJoiSchema);
    const user = await context.session.getUser(context, instData);
    const sprint = await context.sprint.getSprintById(context, data.sprintId);

    if (!sprint) {
        throw new SprintDoesNotExistError();
    }

    const board = await context.block.getBlockById(context, sprint.boardId);

    assertBlock(board);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         orgId: getBlockRootBlockId(board),
    //         resourceType: SystemResourceType.Sprint,
    //         action: SystemActionType.Delete,
    //         permissionResourceId: board.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: board });

    if (!!sprint.startDate) {
        throw new CannotDeleteCurrentOrPastSprintError();
    }

    await context.block.bulkUpdateTaskSprints(
        context,
        data.sprintId,
        null,
        user.customId
    );

    // TODO: bulk update and delete the sprints
    await context.sprint.deleteSprint(context, data.sprintId);

    const bulkSprintUpdates: Array<IUpdateItemById<ISprint>> = [];

    if (sprint.prevSprintId) {
        bulkSprintUpdates.push({
            id: sprint.prevSprintId,
            data: {
                nextSprintId: sprint.nextSprintId || null,
            },
        });
    }

    if (sprint.nextSprintId) {
        bulkSprintUpdates.push({
            id: sprint.nextSprintId,
            data: {
                prevSprintId: sprint.nextSprintId,
            },
        });
    }

    await context.sprint.bulkUpdateSprintsById(context, bulkSprintUpdates);

    const boardUpdates: Partial<IBlock> = {};

    if (sprint.customId === board.lastSprintId) {
        boardUpdates.lastSprintId = sprint.prevSprintId;
    }

    if (Object.keys(boardUpdates).length > 0) {
        // If has board updates
        await context.block.updateBlockById(
            context,
            board.customId,
            boardUpdates
        );
    }

    context.broadcastHelpers.broadcastDeleteSprint(
        context,
        board,
        sprint,
        instData
    );
};

export default deleteSprint;
