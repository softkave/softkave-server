import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import {
    IOutgoingEndSprintPacket,
    OutgoingSocketEvents,
} from "../../socket/server";
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
    const endDateStr = getDateString(endDate);
    const statusList = board.boardStatuses || [];

    if (statusList.length > 1) {
        const incompleteTasksCount = await context.block.countSprintTasks(
            context,
            board.customId,
            sprint.customId,
            statusList.slice(0, statusList.length - 1).map((s) => s.customId)
        );

        if (incompleteTasksCount > 0 && sprint.nextSprintId) {
            const nextSprint = await context.sprint.getSprintById(
                context,
                sprint.nextSprintId
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

    const roomName = context.room.getBlockRoomName(board.type, board.customId);
    const updateSprintPacket: IOutgoingEndSprintPacket = {
        sprintId: sprint.customId,
        endedAt: endDateStr,
        endedBy: user.customId,
    };

    context.room.broadcast(
        context,
        roomName,
        OutgoingSocketEvents.UpdateSprint,
        updateSprintPacket,
        instData
    );

    return { data: { endDate: endDateStr } };
};

export default endSprint;
