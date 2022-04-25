import { SystemActionType, SystemResourceType } from "../../../models/system";
import { BlockType } from "../../../mongo/block";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { throwBoardNotFoundError } from "../../board/utils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import canReadOrganization from "../../organization/canReadBlock";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { ITask } from "../types";
import { getPublicTaskData } from "../utils";
import { CreateTaskEndpoint } from "./types";
import { createTaskJoiSchema } from "./validation";

const createTask: CreateTaskEndpoint = async (context, instData) => {
    const data = validate(instData.data, createTaskJoiSchema);
    const user = await context.session.getUser(context, instData);

    canReadOrganization(data.task.rootBlockId, user);
    await context.block.assertBlockById(
        context,
        data.task.parent,
        throwBoardNotFoundError
    );

    const task: Omit<ITask, "customId"> = {
        createdBy: user.customId,
        createdAt: getDate(),
        name: data.task.name,
        type: BlockType.Task,
        description: data.task.description,
        parent: data.task.parent,
        rootBlockId: data.task.rootBlockId,
        assignees: data.task.assignees.map((item) => ({
            assignedAt: getDate(),
            assignedBy: user.customId,
            userId: item.userId,
        })),
        priority: data.task.priority,
        subTasks: data.task.subTasks.map((item) => ({
            createdAt: getDate(),
            createdBy: user.customId,
            customId: item.customId,
            description: item.description,
            completedBy: item.completedBy,
            completedAt: item.completedBy ? getDate() : null,
        })),
        status: data.task.status,
        statusAssignedBy: data.task.status ? user.customId : null,
        statusAssignedAt: data.task.status ? getDate() : null,
        taskResolution: data.task.taskResolution,
        labels: data.task.labels.map((item) => ({
            assignedAt: getDate(),
            assignedBy: user.customId,
            customId: item.customId,
        })),
        dueAt: data.task.dueAt ? getDate() : null,
        taskSprint: data.task.taskSprint
            ? {
                  assignedAt: getDate(),
                  assignedBy: user.customId,
                  sprintId: data.task.taskSprint.sprintId,
              }
            : null,
    };

    const savedTask = await context.block.saveBlock<ITask>(context, task);
    const taskData = getPublicTaskData(savedTask);
    outgoingEventFn(
        context,
        SocketRoomNameHelpers.getBoardRoomName(savedTask.parent),
        {
            actionType: SystemActionType.Create,
            resourceType: SystemResourceType.Task,
            resource: taskData,
        }
    );

    return {
        task: getPublicTaskData(savedTask),
    };
};

export default createTask;
