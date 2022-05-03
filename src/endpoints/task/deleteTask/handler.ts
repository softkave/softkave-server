import { SystemActionType, SystemResourceType } from "../../../models/system";
import { validate } from "../../../utilities/joiUtils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import canReadOrganization from "../../organization/canReadBlock";
import outgoingEventFn from "../../socket/outgoingEventFn";
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
    outgoingEventFn(
        context,
        SocketRoomNameHelpers.getBoardRoomName(task.parent),
        {
            actionType: SystemActionType.Delete,
            resourceType: SystemResourceType.Task,
            resource: { customId: task.customId },
        }
    );
};

export default deleteTask;
