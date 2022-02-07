import { ISprint } from "../../../mongo/sprint";
import { indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { IBoard } from "../../board/types";
import canReadOrganization from "../../organization/canReadBlock";
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

    const updatedTask = await context.block.updateBlockById<ITask>(
        context,
        data.taskId,
        update
    );

    assertTask(updatedTask);
    fireAndForgetPromise(
        sendNewlyAssignedTaskEmail(context, instData, task, update, updatedTask)
    );

    if (newBoardId && task.parent !== newBoardId) {
        return await context.transferTask(context, {
            ...instData,
            data: {
                boardId: newBoardId,
                taskId: task.customId,
            },
        });
    }

    return { task: getPublicTaskData(updatedTask) };
};

export default updateTask;
