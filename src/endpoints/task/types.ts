import {
    BlockType,
    IAssignee,
    IBlockAssignedLabel,
    ISubTask,
    ITaskSprint,
} from "../../mongo/block";
import { ConvertDatesToStrings } from "../../utilities/types";
import { IResourceWithId } from "../types";

export interface IAssigneeInput {
    userId: string;
}

export interface ISubTaskInput extends IResourceWithId {
    description: string;
    completedBy?: string;
}

export interface IBlockAssignedLabelInput {
    customId: string;
}

export interface ITaskSprintInput {
    sprintId: string;
}

export interface ITask {
    customId: string;
    createdBy: string;
    createdAt: Date;
    name: string;
    type: BlockType.Task;
    description?: string;
    updatedAt?: Date;
    updatedBy?: string;
    parent: string;
    rootBlockId: string;
    assignees: IAssignee[];
    priority: string;
    subTasks: ISubTask[]; // should sub-tasks be their own blocks?
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: Date;
    taskResolution?: string;
    labels: IBlockAssignedLabel[];
    dueAt?: Date;
    taskSprint?: ITaskSprint;
}

export interface INewTaskInput {
    name: string;
    description?: string;
    dueAt?: string;
    parent: string;
    rootBlockId: string;
    assignees: IAssigneeInput[];
    priority: string;
    subTasks: ISubTaskInput[];
    status?: string;
    taskResolution?: string;
    labels: IBlockAssignedLabelInput[];
    taskSprint?: ITaskSprintInput;
}

export type IPublicTask = ConvertDatesToStrings<{
    customId: string;
    createdBy: string;
    createdAt: string;
    name: string;
    description?: string;
    type: BlockType.Task;
    dueAt?: string;
    updatedAt?: string;
    updatedBy?: string;
    parent: string;
    rootBlockId: string;
    assignees: IAssignee[];
    priority: string;
    subTasks: ISubTask[]; // should sub-tasks be their own blocks?
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: string;
    taskResolution?: string;
    labels: IBlockAssignedLabel[];
    taskSprint?: ITaskSprint;
}>;
