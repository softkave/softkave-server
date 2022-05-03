import { merge, omit } from "lodash";
import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { ISprint } from "../../../mongo/sprint";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import outgoingEventFn from "../../socket/outgoingEventFn";
import {
    CannotRestartCurrentOrPastSprintsError,
    CannotStartSprintCauseCurrentSprintExistsError,
    SprintDoesNotExistError,
} from "../errors";
import { getPublicSprintData } from "../utils";
import { UpdateSprintEndpoint } from "./types";
import { updateSprintJoiSchema } from "./validation";

const updateSprint: UpdateSprintEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateSprintJoiSchema);
    const user = await context.session.getUser(context, instData);
    const sprint = await context.sprint.getSprintById(context, data.sprintId);

    if (!sprint) {
        throw new SprintDoesNotExistError();
    }

    const board = await context.block.getBlockById(context, sprint.boardId);
    assertBlock(board);
    canReadBlock({ user, block: board });
    let updatedSprint: ISprint;
    const update: Partial<ISprint> = {
        ...omit(data.data, "startDate", "endDate"),
        updatedAt: getDate(),
        updatedBy: user.customId,
    };

    if (data.data.startDate) {
        if (board.currentSprintId) {
            throw new CannotStartSprintCauseCurrentSprintExistsError();
        }

        if (!!sprint.endDate) {
            throw new CannotRestartCurrentOrPastSprintsError();
        }

        merge(update, { startDate: getDate(), startedBy: user.customId });
        updatedSprint = await context.sprint.updateSprintById(
            context,
            sprint.customId,
            update
        );

        await context.block.updateBlockById(context, board.customId, {
            currentSprintId: sprint.customId,
        });
    } else if (data.data.endDate) {
        const statusList = board.boardStatuses || [];
        const endDate = getDate();
        merge(update, { endDate, endedBy: user.customId });
        updatedSprint = await context.sprint.updateSprintById(
            context,
            sprint.customId,
            update
        );

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
    }

    const sprintData = getPublicSprintData(updatedSprint);
    outgoingEventFn(
        context,
        SocketRoomNameHelpers.getBoardRoomName(board.customId),
        {
            actionType: SystemActionType.Update,
            resourceType: SystemResourceType.Sprint,
            resource: sprintData,
        }
    );

    return { sprint: sprintData };
};

export default updateSprint;
