import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { ITask } from "../types";
import { throwTaskNotFoundError } from "../utils";
import { DeleteTaskEndpoint } from "./types";
import { deleteTaskJoiSchema } from "./validation";

const deleteTask: DeleteTaskEndpoint = async (context, instData) => {
    const data = validate(instData.data, deleteTaskJoiSchema);
    const user = await context.session.getUser(context, instData);
    const task = await context.block.assertGetBlockById<ITask>(
        context,
        data.taskId,
        throwTaskNotFoundError
    );

    canReadOrganization(task.rootBlockId, user);
    await context.block.deleteBlockAndChildren(context, task.customId);
};

export default deleteTask;
