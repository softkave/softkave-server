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

    // TODO: how can we update only the changed parts?
    await context.block.updateBlockById(context, board.customId, {
        sprintOptions: {
            ...board.sprintOptions,
            ...data.data,
            updatedAt,
            updatedBy: user.customId,
        },
    });

    // TODO: update the rest of the sprints not started yet
    await context.sprint.updateUnstartedSprints(context, board.customId, {
        duration: data.data.duration,
    });

    return { data: { updatedAt: getDateString(updatedAt) } };
};

export default updateSprintOptions;
