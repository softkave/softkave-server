import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { StartSprintEndpoint } from "./types";
import { startSprintJoiSchema } from "./validation";

const startSprint: StartSprintEndpoint = async (context, instData) => {
    const data = validate(instData.data, startSprintJoiSchema);
    const user = await context.session.getUser(context, instData);
    const sprint = await context.sprint.getSprintById(context, data.sprintId);
    const block = await context.block.getBlockById(context, sprint.boardId);

    canReadBlock({ user, block });
};

export default startSprint;
