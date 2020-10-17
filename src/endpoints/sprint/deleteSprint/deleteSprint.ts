import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { DeleteSprintEndpoint } from "./types";
import { deleteSprintJoiSchema } from "./validation";

const deleteSprint: DeleteSprintEndpoint = async (context, instData) => {
    const data = validate(instData.data, deleteSprintJoiSchema);
    const user = await context.session.getUser(context, instData);
    const sprint = await context.sprint.getSprintById(context, data.sprintId);
    const block = await context.block.getBlockById(context, sprint.boardId);

    canReadBlock({ user, block });
};

export default deleteSprint;
