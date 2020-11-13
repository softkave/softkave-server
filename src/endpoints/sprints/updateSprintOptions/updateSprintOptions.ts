import { IBoardSprintOptions } from "../../../mongo/sprint";
import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { SprintsNotSetupYetError } from "../errors";
import { UpdateSprintOptionsEndpoint } from "./types";
import { updateSprintOptionsJoiSchema } from "./validation";

const updateSprintOptions: UpdateSprintOptionsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, updateSprintOptionsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    await canReadBlock({ user, block: board });

    if (!board.sprintOptions) {
        throw new SprintsNotSetupYetError();
    }

    const updatedAt = getDate();
    const sprintOptions: IBoardSprintOptions = {
        ...board.sprintOptions,
        ...data.data,
        updatedAt,
        updatedBy: user.customId,
    };

    // TODO: how can we update only the changed parts?
    await context.block.updateBlockById(context, board.customId, {
        sprintOptions,
    });

    // TODO: update the rest of the sprints not started yet
    await context.sprint.updateUnstartedSprints(context, board.customId, {
        duration: data.data.duration,
    });

    context.broadcastHelpers.broadcastBlockUpdate(context, instData, {
        block: board,
        updateType: { isUpdate: true },
        data: {
            sprintOptions,
        },
        blockId: board.customId,
        blockType: board.type,
        parentId: board.parent,
    });

    return { data: { updatedAt: getDateString(updatedAt) } };
};

export default updateSprintOptions;
