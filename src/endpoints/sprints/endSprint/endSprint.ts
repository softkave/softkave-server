import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { ISprint } from "../../../mongo/sprint";
import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
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
    await context.accessControl.assertPermission(
        context,
        {
            orgId: getBlockRootBlockId(board),
            resourceType: SystemResourceType.Sprint,
            action: SystemActionType.Update,
            permissionResourceId: board.permissionResourceId,
        },
        user
    );

    const endDate = getDate();
    const endDateStr = getDateString(endDate);
    const statusList = board.boardStatuses || [];

    if (statusList.length > 1) {
        let nextSprint: ISprint;

        if (sprint.nextSprintId) {
            nextSprint = await context.sprint.getSprintById(
                context,
                sprint.nextSprintId
            );
        }

        await context.block.bulkUpdateTaskSprints(
            context,
            sprint.customId,
            nextSprint
                ? {
                      sprintId: nextSprint.customId,
                      assignedAt: endDate,
                      assignedBy: user.customId,
                  }
                : null,
            user.customId
        );
    }

    await context.block.updateBlockById(context, board.customId, {
        currentSprintId: null,
    });

    await context.sprint.updateSprintById(context, sprint.customId, {
        endDate,
        endedBy: user.customId,
    });

    context.broadcastHelpers.broadcastSprintUpdate(
        context,
        user,
        board,
        sprint,
        {
            endDate,
            endedBy: user.customId,
        },
        endDateStr,
        instData
    );

    return { endDate: endDateStr };
};

export default endSprint;
