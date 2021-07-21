import { assertBlock } from "../../../mongo/block/utils";
import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { SprintDoesNotExistError } from "../errors";
import { EndSprintEndpoint } from "./types";
import { endSprintJoiSchema } from "./validation";

const endSprint: EndSprintEndpoint = async (context, instData) => {
    const data = validate(instData.data, endSprintJoiSchema);
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
    //         organizationId: getBlockRootBlockId(board),
    //         resourceType: SystemResourceType.Sprint,
    //         action: SystemActionType.Update,
    //         permissionResourceId: board.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: board });

    const endDate = getDate();
    const endDateStr = getDateString(endDate);
    const statusList = board.boardStatuses || [];

    // move incomplete tasks to the next sprint
    await context.block.bulkUpdateTaskSprints(
        context,
        sprint.customId,
        sprint.nextSprintId
            ? {
                  sprintId: sprint.nextSprintId,
                  assignedAt: endDate,
                  assignedBy: user.customId,
              }
            : null,
        user.customId,
        getDate(),

        // exclude completed tasks
        statusList.slice(-1).map((s) => s.customId)
    );

    await context.block.updateBlockById(context, board.customId, {
        currentSprintId: null,
    });

    await context.sprint.updateSprintById(context, sprint.customId, {
        endDate,
        endedBy: user.customId,
    });

    context.broadcastHelpers.broadcastSprintUpdate(
        context,
        instData,
        user,
        board,
        sprint,
        {
            endDate,
            endedBy: user.customId,
        },
        endDateStr
    );

    return { endDate: endDateStr };
};

export default endSprint;
