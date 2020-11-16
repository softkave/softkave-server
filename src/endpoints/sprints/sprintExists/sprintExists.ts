import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { SprintExistsEndpoint } from "./types";
import { sprintExistsJoiSchema } from "./validation";

const sprintExists: SprintExistsEndpoint = async (context, instData) => {
    const data = validate(instData.data, sprintExistsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    if (!board) {
        return { exists: false };
    }

    canReadBlock({ user, block: board });

    const doesSprintExist = await context.sprint.sprintExists(
        context,
        data.name,
        data.boardId
    );

    return { exists: doesSprintExist };
};

export default sprintExists;
