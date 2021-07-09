import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { TaskDoesNotExistError } from "./errors";
import { IPublicTask, ITask } from "./types";

const taskFields = getFields<IPublicTask>({
    customId: true,
    createdBy: true,
    createdAt: getDateString,
    name: true,
    description: true,
    dueAt: true,
    type: true,
    updatedAt: getDateString,
    updatedBy: true,
    parent: true,
    rootBlockId: true,
    assignees: {
        assignedAt: getDateString,
        assignedBy: true,
        userId: true,
    },
    priority: true,
    subTasks: {
        createdAt: getDateString,
        createdBy: true,
        customId: true,
        description: true,
        completedAt: getDateString,
        completedBy: true,
        updatedAt: getDateString,
        updatedBy: true,
    },
    status: true,
    statusAssignedBy: true,
    statusAssignedAt: getDateString,
    taskResolution: true,
    labels: {
        assignedAt: getDateString,
        assignedBy: true,
        customId: true,
    },
    taskSprint: {
        assignedAt: getDateString,
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
