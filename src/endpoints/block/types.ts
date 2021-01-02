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
import { ICollaborationRequest } from "../../mongo/collaboration-request";
import { IBoardSprintOptions } from "../../mongo/sprint";
import { ConvertDatesToStrings } from "../../utilities/types";
import { IResourceWithId } from "../types";

export interface IAssigneeInput {
    userId: string;
}

export interface ISubTaskInput extends IResourceWithId {
    description: string;
    completedBy?: string;
}

export interface IBlockStatusInput extends IResourceWithId {
    name: string;
    color: string;
    position: number;
    description?: string;
}

export interface IBlockLabelInput extends IResourceWithId {
    name: string;
    color: string;
    description?: string;
}

export interface IBoardStatusResolutionInput extends IResourceWithId {
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
    dueAt?: string;
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
    permissionResourceId?: string;
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
