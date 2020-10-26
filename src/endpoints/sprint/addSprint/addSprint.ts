import { IBlock } from "../../../mongo/block";
import { ISprint } from "../../../mongo/sprint";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import {
    IOutgoingNewSprintPacket,
    OutgoingSocketEvents,
} from "../../socket/server";
import { SprintsNotSetupYetError, SprintWithNameExistsError } from "../errors";
import getPublicSprintData from "../getPublicSprintData";
import { AddSprintEndpoint } from "./types";
import { addSprintJoiSchema } from "./validation";

const addSprint: AddSprintEndpoint = async (context, instData) => {
    const data = validate(instData.data, addSprintJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    await canReadBlock({ user, block: board });

    if (!board.sprintOptions) {
        throw new SprintsNotSetupYetError();
    }

    const sprintWithNameExists = await context.sprint.sprintExists(
        context,
        data.data.name,
        data.boardId
    );

    if (sprintWithNameExists) {
        throw new SprintWithNameExistsError();
    }

    let sprint: ISprint = {
        customId: getNewId(),
        boardId: data.boardId,
        orgId: board.rootBlockId,
        duration: data.data.duration,
        name: data.data.name,
        createdAt: getDate(),
        createdBy: user.customId,
        prevSprintId: board.lastSprintId,
        sprintIndex: board.nextSprintIndex,
    };

    // TODO: can we bulk update these?
    sprint = await context.sprint.saveSprint(context, sprint);

    if (board.lastSprintId) {
        await context.sprint.updateSprintById(context, board.lastSprintId, {
            nextSprintId: sprint.customId,
        });
    }

    const boardUpdates: Partial<IBlock> = {
        lastSprintId: sprint.customId,
        nextSprintIndex: (board.nextSprintIndex || 0) + 1,
    };

    await context.block.updateBlockById(context, board.customId, boardUpdates);

    const roomName = context.room.getBlockRoomName(board.type, board.customId);
    const newSprintPacket: IOutgoingNewSprintPacket = {
        sprint: getPublicSprintData(sprint),
    };

    context.room.broadcast(
        context,
        roomName,
        OutgoingSocketEvents.NewSprint,
        newSprintPacket,
        instData
    );

    return { data: sprint };
};

export default addSprint;
