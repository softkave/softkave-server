import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { SprintDoesNotExistError } from "../errors";
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

    await canReadBlock({ user, block: board });

    const updatedAt = getDate();
    const updatedAtStr = getDateString(updatedAt);

    const updatedSprint = await context.sprint.updateSprintById(
        context,
        sprint.customId,
        {
            ...data.data,
            updatedAt,
            updatedBy: user.customId,
        }
    );

    context.broadcastHelpers.broadcastSprintUpdate(
        context,
        user,
        board,
        sprint,
        data.data,
        updatedAtStr,
        instData
    );

    return { sprint: getPublicSprintData(updatedSprint) };
};

export default updateSprint;
