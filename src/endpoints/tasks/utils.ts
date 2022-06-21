import { getDateString, getDateStringIfExists } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { TaskDoesNotExistError } from "./errors";
import { IPublicTask, ITask } from "./types";

const taskFields = getFields<IPublicTask>({
    customId: true,
    createdBy: true,
    createdAt: getDateStringIfExists,
    name: true,
    description: true,
    dueAt: true,
    type: true,
    updatedAt: getDateStringIfExists,
    updatedBy: true,
    parent: true,
    rootBlockId: true,
    assignees: {
        assignedAt: getDateStringIfExists,
        assignedBy: true,
        userId: true,
    },
    priority: true,
    subTasks: {
        createdAt: getDateStringIfExists,
        createdBy: true,
        customId: true,
        description: true,
        completedAt: getDateStringIfExists,
        completedBy: true,
        updatedAt: getDateStringIfExists,
        updatedBy: true,
    },
    status: true,
    statusAssignedBy: true,
    statusAssignedAt: getDateStringIfExists,
    taskResolution: true,
    labels: {
        assignedAt: getDateStringIfExists,
        assignedBy: true,
        customId: true,
    },
    taskSprint: {
        assignedAt: getDateStringIfExists,
        assignedBy: true,
        sprintId: true,
    },
});

export function getPublicTaskData(block: Partial<ITask>): IPublicTask {
    return extractFields(block, taskFields);
}

export function getPublicTasksArray(
    blocks: Array<Partial<ITask>>
): IPublicTask[] {
    return blocks.map((block) => extractFields(block, taskFields));
}

export function throwTaskNotFoundError() {
    throw new TaskDoesNotExistError();
}

export function assertTask(board?: ITask | null) {
    if (!board) {
        throwTaskNotFoundError();
    }
}
