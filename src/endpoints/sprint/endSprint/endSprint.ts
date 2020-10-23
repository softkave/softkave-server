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

    canReadBlock({ user, block: board });

    const endDate = getDate();
    const statusList = board.boardStatuses || [];

    if (statusList.length > 1) {
        const incompleteTasks = await context.block.bulkGetSprintTasks(
            context,
            board.customId,
            sprint.customId,
            statusList.slice(0, statusList.length - 1).map((s) => s.customId)
        );

        if (incompleteTasks.length > 0) {
            const nextSprint = await context.sprint.getSprintByIndex(
                context,
                board.customId,
                sprint.sprintIndex
            );

            if (nextSprint) {
                await context.block.bulkUpdateTaskSprints(
                    context,
                    sprint.customId,
                    {
                        sprintId: nextSprint.customId,
                        assignedAt: endDate,
                        assignedBy: user.customId,
                    },
                    user.customId
                );
            }
        }
    }

    await context.block.updateBlockById(context, board.customId, {
        currentSprintId: null,
    });

    await context.sprint.updateSprintById(context, sprint.customId, {
        endDate,
        endedBy: user.customId,
    });

    return { data: { endDate: getDateString(endDate) } };
};

export default endSprint;
