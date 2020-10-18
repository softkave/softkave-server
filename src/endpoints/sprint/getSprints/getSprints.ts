import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { GetSprintsEndpoint } from "./types";
import { getSprintsJoiSchema } from "./validation";

const getSprints: GetSprintsEndpoint = async (context, instData) => {
    const data = validate(instData.data, getSprintsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    canReadBlock({ user, block: board });

    const sprints = await context.sprint.getSprintsByBoardId(
        context,
        board.customId
    );

    return { sprints };
};

export default getSprints;
