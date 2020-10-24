import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import {
    IOutgoingDeleteSprintPacket,
    OutgoingSocketEvents,
} from "../../socket/server";
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

    await context.sprint.deleteSprint(context, data.sprintId);

    const roomName = context.room.getBlockRoomName(board.type, board.customId);
    const deleteSprintPacket: IOutgoingDeleteSprintPacket = {
        sprintId: sprint.customId,
    };

    context.room.broadcast(
        context,
        roomName,
        OutgoingSocketEvents.DeleteSprint,
        deleteSprintPacket,
        instData
    );
};

export default deleteSprint;
