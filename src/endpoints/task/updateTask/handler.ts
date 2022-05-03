import { merge } from "lodash";
import { SystemActionType, SystemResourceType } from "../../../models/system";
import { ISprint } from "../../../mongo/sprint";
import { getDate, indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { IBoard } from "../../board/types";
import { throwBoardNotFoundError } from "../../board/utils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import canReadOrganization from "../../organization/canReadBlock";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { fireAndForgetPromise } from "../../utils";
import { ITask } from "../types";
import {
    assertTask,
    getPublicTaskData,
    throwTaskNotFoundError,
} from "../utils";
import processUpdateTaskInput from "./processUpdateBlockInput";
import sendNewlyAssignedTaskEmail from "./sendNewAssignedTaskEmail";
import { UpdateTaskEndpoint } from "./types";
import { updateTaskJoiSchema } from "./validation";

const updateTask: UpdateTaskEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateTaskJoiSchema);
    const updateData = data.data;
    const user = await context.session.getUser(context, instData);
    const task = await context.block.assertGetBlockById<ITask>(
        context,
        data.taskId,
        throwTaskNotFoundError
    );

    canReadOrganization(task.rootBlockId, user);

    // Parent update ( tranferring block ) is handled separately by transferBlock
    const newBoardId = updateData.parent;
    delete updateData.parent;

    let existingSprint: ISprint | null = null;
    let newSprint: ISprint | null = null;
    let existingSprintId = "";
    let newSprintId = "";
    const board = await context.block.assertGetBlockById<IBoard>(
        context,
        task.parent
    );

    const sprintIds: string[] = [];
    let sprintsResult: ISprint[] = [];

    if (task.taskSprint?.sprintId) {
        sprintIds.push(task.taskSprint.sprintId);
        existingSprintId = task.taskSprint.sprintId;
    }

    if (data.data.taskSprint?.sprintId) {
        sprintIds.push(data.data.taskSprint.sprintId);
        newSprintId = data.data.taskSprint.sprintId;
    }

    if (sprintIds.length > 0) {
        sprintsResult = await context.sprint.getMany(context, sprintIds);
    }

    sprintsResult.forEach((sprint) => {
        switch (sprint.customId) {
            case existingSprintId:
                existingSprint = sprint;
                break;

            case newSprintId:
                newSprint = sprint;
                break;
        }
    });

    const update = processUpdateTaskInput(
        task,
        updateData,
        user,
        board,
        existingSprint,
        newSprint
    );

    if (update.assignees?.length > 0) {
        const users = await context.user.bulkGetUsersById(
            context,
            update.assignees.map((a) => a.userId)
        );

        const usersMap = indexArray(users, { path: "customId" });
        update.assignees = update.assignees.filter((assignee) => {
            const assigneeUserData = usersMap[assignee.userId];

            if (!assigneeUserData) {
                return false;
            }

            return !!assigneeUserData.orgs.find(
                (item) => item.customId === task.rootBlockId
            );
        });
    }

    if (newBoardId && task.parent !== newBoardId) {
        const destBoard = await context.block.assertGetBlockById<IBoard>(
            context,
            newBoardId,
            throwBoardNotFoundError
        );

        const status0 = destBoard.boardStatuses[0];
        const parentChangeUpdates: Partial<ITask> = {
            parent: destBoard.customId,
            status: status0 ? status0.customId : null,
            statusAssignedAt: status0 ? getDate() : null,
            statusAssignedBy: status0 ? user.customId : null,
            labels: [],
            taskSprint: null,
            taskResolution: null,
        };

        merge(update, parentChangeUpdates);
    }

    const updatedTask = await context.block.updateBlockById<ITask>(
        context,
        data.taskId,
        update
    );

    assertTask(updatedTask);
    fireAndForgetPromise(
        sendNewlyAssignedTaskEmail(context, instData, task, update, updatedTask)
    );

    const taskData = getPublicTaskData(updatedTask);
    outgoingEventFn(
        context,
        SocketRoomNameHelpers.getBoardRoomName(updatedTask.parent),
        {
            actionType: SystemActionType.Update,
            resourceType: SystemResourceType.Task,
            resource: taskData,
        }
    );

    return { task: taskData };
};

export default updateTask;
