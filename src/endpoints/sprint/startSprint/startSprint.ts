import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
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

    await context.sprint.updateSprintById(context, sprint.customId, {
        startDate,
        startedBy: user.customId,
    });

    await context.block.updateBlockById(context, board.customId, {
        currentSprintId: sprint.customId,
    });

    return { data: { startDate: getDateString(startDate) } };
};

export default startSprint;
