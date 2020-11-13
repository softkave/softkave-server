import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import {
    IOutgoingUpdateSprintPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { SprintDoesNotExistError } from "../errors";
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

    await canReadBlock({ user, block: board });

    const updatedAt = getDate();

    await context.sprint.updateSprintById(context, sprint.customId, {
        ...data.data,
        updatedAt,
        updatedBy: user.customId,
    });

    const updatedAtStr = getDateString(updatedAt);
    const roomName = context.room.getBlockRoomName(board.type, board.customId);
    const startSprintPacket: IOutgoingUpdateSprintPacket = {
        sprintId: sprint.customId,
        data: {
            ...data.data,
            updatedAt: updatedAtStr,
            updatedBy: user.customId,
        },
    };

    context.room.broadcast(
        context,
        roomName,
        OutgoingSocketEvents.UpdateSprint,
        startSprintPacket,
        instData
    );

    return { data: { updatedAt: updatedAtStr } };
};

export default updateSprint;
