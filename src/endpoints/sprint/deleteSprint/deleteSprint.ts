import { IBlock } from "../../../mongo/block";
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

    if (sprint.nextSprintId) {
        await context.sprint.updateSprintById(context, sprint.nextSprintId, {
            prevSprintId: sprint.prevSprintId,
        });
    }

    const boardUpdates: Partial<IBlock> = {};

    if (sprint.sprintIndex === board.nextSprintIndex - 1) {
        boardUpdates.nextSprintIndex = board.nextSprintIndex - 1;
    }

    if (sprint.customId === board.lastSprintId) {
        boardUpdates.lastSprintId = sprint.prevSprintId;
    }

    if (Object.keys(boardUpdates).length > 0) {
        // If has board updates
        await context.block.updateBlockById(context, board.customId, {
            nextSprintIndex: board.nextSprintIndex - 1,
        });
    }

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
