import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { SprintExistsEndpoint } from "./types";
import { sprintExistsJoiSchema } from "./validation";

const sprintExists: SprintExistsEndpoint = async (context, instData) => {
    const data = validate(instData.data, sprintExistsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockByName(context, data.name);

    if (!board) {
        return false;
    }

    canReadBlock({ user, block: board });

    return await context.sprint.sprintExists(context, data.name, data.boardId);
};

export default sprintExists;
