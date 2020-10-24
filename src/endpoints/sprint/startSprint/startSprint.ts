import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import {
    IOutgoingStartSprintPacket,
    OutgoingSocketEvents,
} from "../../socket/server";
import {
    CannotRestartCurrentOrPastSprintsError,
    CannotStartSprintCauseCurrentSprintExistsError,
    SprintDoesNotExistError,
} from "../errors";
import { StartSprintEndpoint } from "./types";
import { startSprintJoiSchema } from "./validation";

const startSprint: StartSprintEndpoint = async (context, instData) => {
    const data = validate(instData.data, startSprintJoiSchema);
    const user = await context.session.getUser(context, instData);
    const sprint = await context.sprint.getSprintById(context, data.sprintId);

    if (!sprint) {
        throw new SprintDoesNotExistError();
    }

    const board = await context.block.getBlockById(context, sprint.boardId);

    canReadBlock({ user, block: board });

    if (board.currentSprintId) {
        throw new CannotStartSprintCauseCurrentSprintExistsError();
    }

    if (!!sprint.endDate) {
        throw new CannotRestartCurrentOrPastSprintsError();
    }

    const startDate = getDate();
    const startDateStr = getDateString(startDate);

    await context.sprint.updateSprintById(context, sprint.customId, {
        startDate,
        startedBy: user.customId,
    });

    await context.block.updateBlockById(context, board.customId, {
        currentSprintId: sprint.customId,
    });

    const roomName = context.room.getBlockRoomName(board.type, board.customId);
    const startSprintPacket: IOutgoingStartSprintPacket = {
        sprintId: sprint.customId,
        startedAt: startDateStr,
        startedBy: user.customId,
    };

    context.room.broadcast(
        context,
        roomName,
        OutgoingSocketEvents.StartSprint,
        startSprintPacket,
        instData
    );

    return { data: { startDate: startDateStr } };
};

export default startSprint;
