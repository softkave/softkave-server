import { assertBlock } from "../../../mongo/block/utils";
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

    context.broadcastHelpers.broadcastStartSprint(
        context,
        instData,
        user,
        board,
        sprint,
        startDateStr
    );

    return { startDate: startDateStr };
};

export default startSprint;
