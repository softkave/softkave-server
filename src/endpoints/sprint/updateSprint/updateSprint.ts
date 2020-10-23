import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
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

    return { data: { updatedAt: getDateString(updatedAt) } };
};

export default updateSprint;
