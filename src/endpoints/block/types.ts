import {
    BlockType,
    IAssignee,
    IBlockAssignedLabel,
    IBlockLabel,
    IBlockStatus,
    IBoardStatusResolution,
    ISubTask,
    ITaskSprint,
} from "../../mongo/block";
import { IBoardSprintOptions } from "../../mongo/sprint";
import { ConvertDatesToStrings } from "../../utilities/types";

export interface IAssigneeInput {
    userId: string;
}

export interface ISubTaskInput {
    description: string;
    completedBy?: string;
}

export interface IBlockStatusInput {
    name: string;
    color: string;
    description?: string;
}

export interface IBlockLabelInput {
    name: string;
    color: string;
    description?: string;
}

export interface IBoardStatusResolutionInput {
    name: string;
    description?: string;
}

export interface IBlockAssignedLabelInput {
    customId: string;
}

export interface ITaskSprintInput {
    sprintId: string;
}

export interface INewBlockInput {
    type: BlockType;
    name: string;
    description?: string;
    dueAt?: number;
    color?: string;
    parent?: string;
    rootBlockId?: string;
    assignees?: IAssigneeInput[];
    priority?: string;
    subTasks?: ISubTaskInput[];
    boardStatuses?: IBlockStatusInput[];
    boardLabels?: IBlockLabelInput[];
    boardResolutions?: IBoardStatusResolutionInput[];
    status?: string;
    taskResolution?: string;
    labels?: IBlockAssignedLabelInput[];
    taskSprint?: ITaskSprintInput;
}

export type IPublicBlock = ConvertDatesToStrings<{
    customId: string;
    createdBy: string;
    createdAt: string;
    type: BlockType;
    name: string;
    description?: string;
    dueAt?: string;
    color?: string;
    updatedAt?: string;
    updatedBy?: string;
    parent?: string;
    rootBlockId?: string;
    assignees?: IAssignee[];
    priority?: string;
    subTasks?: ISubTask[]; // should sub-tasks be their own blocks?
    boardStatuses?: IBlockStatus[];
    boardLabels?: IBlockLabel[];
    boardResolutions?: IBoardStatusResolution[];
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: string;
    taskResolution?: string;
    labels?: IBlockAssignedLabel[];
    currentSprintId?: string;
    taskSprint?: ITaskSprint;
    sprintOptions?: IBoardSprintOptions;
    lastSprintId?: string;
}>;
