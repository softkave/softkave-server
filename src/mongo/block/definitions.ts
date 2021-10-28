import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";
import { boardSprintOptionsSchema, IBoardSprintOptions } from "../sprint";

export const blockSchemaVersion = 3; // increment when you make changes that are not backward compatible

export interface IAssignee {
    userId: string;
    assignedAt: Date;
    assignedBy: string;
}

export const blockAssigneeSchema = {
    userId: String,
    assignedAt: Date,
    assignedBy: String,
};

export interface ISubTask {
    customId: string;
    description: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
    completedBy?: string;
    completedAt?: Date;
}

export const subTaskSchema = {
    customId: String,
    description: String,
    createdAt: Date,
    createdBy: String,
    updatedAt: Date,
    updatedBy: String,
    completedBy: String,
    completedAt: Date,
};

export interface IBlockLabel {
    customId: string;
    name: string;
    color: string;
    createdBy: string;
    createdAt: Date;
    description?: string;
    updatedBy?: string;
    updatedAt?: Date;
}

export const blockLabelSchema = {
    customId: { type: String },
    name: { type: String },
    color: { type: String },
    description: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: Date },
};

export interface IBlockStatus {
    customId: string;
    name: string;
    color: string;
    createdBy: string;
    createdAt: Date;
    position: number;
    description?: string;
    updatedBy?: string;
    updatedAt?: Date;
}

export const blockStatusSchema = {
    customId: { type: String },
    name: { type: String },
    description: { type: String },
    color: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date },
    position: { type: Number },
    updatedBy: { type: String },
    updatedAt: { type: Date },
};

export enum BlockType {
    Root = "root",
    Organization = "org",
    Board = "board",
    Task = "task",
}

export enum BlockPriority {
    Medium = "medium",
    Low = "low",
    High = "high",
}

export interface IBlockAssignedLabel {
    customId: string;
    assignedBy: string;
    assignedAt: Date;
}

export const blockAssignedLabelSchema = {
    customId: { type: String },
    assignedBy: { type: String },
    assignedAt: { type: Date },
};

export interface IBoardStatusResolution {
    customId: string;
    name: string;
    createdBy: string;
    createdAt: Date;
    description?: string;
    updatedBy?: string;
    updatedAt?: Date;
}

export const boardStatusResolutionSchema = {
    customId: { type: String },
    name: { type: String },
    description: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: Date },
};

export interface ITaskSprint {
    sprintId: string;
    assignedAt: Date;
    assignedBy: string;
}

export const taskSprintSchema = {
    sprintId: { type: String },
    assignedAt: { type: Date },
    assignedBy: { type: String },
};

export interface IBlock {
    // General
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType;
    name?: string;
    description?: string;
    updatedAt?: Date;
    updatedBy?: string;
    parent?: string;
    rootBlockId?: string;
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    permissionResourceId?: string;

    // Organizations and boards
    color?: string;
    publicPermissionGroupId?: string;
    // newPermissionsManagerId?: string;
    // permissionGroupsSystemType?: AccessControlPermissionGroupSystemType;

    // Tasks
    assignees?: IAssignee[];
    priority?: string;
    subTasks?: ISubTask[]; // should sub-tasks be their own blocks?
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: Date;
    taskResolution?: string;
    labels?: IBlockAssignedLabel[];
    dueAt?: Date;
    taskSprint?: ITaskSprint;

    // Boards
    boardStatuses?: IBlockStatus[];
    boardLabels?: IBlockLabel[];
    boardResolutions?: IBoardStatusResolution[];
    currentSprintId?: string;
    sprintOptions?: IBoardSprintOptions;
    lastSprintId?: string;
}

const blockSchema = {
    // General
    customId: { type: String, unique: true, index: true },
    name: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: () => getDate() },
    createdBy: { type: String },
    updatedAt: { type: Date },
    updatedBy: { type: String },
    type: { type: String, index: true },
    parent: { type: String, index: true },
    rootBlockId: { type: String },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
    permissionResourceId: { type: String },

    // Organizations and boards
    color: { type: String },
    publicPermissionGroupId: { type: String },

    // Tasks
    assignees: { type: [blockAssigneeSchema], default: [] },
    priority: { type: String },
    subTasks: { type: [subTaskSchema], default: [] },
    dueAt: { type: Date },
    status: { type: String },
    statusAssignedBy: { type: String },
    statusAssignedAt: { type: Date },
    taskResolution: { type: String },
    labels: { type: [blockAssignedLabelSchema], default: [] },
    taskSprint: { type: taskSprintSchema },

    // Boards
    boardStatuses: { type: [blockStatusSchema], default: [] },
    boardLabels: { type: [blockLabelSchema], default: [] },
    boardResolutions: { type: boardStatusResolutionSchema, default: [] },
    currentSprintId: { type: String },
    sprintOptions: { type: boardSprintOptionsSchema },
    lastSprintId: { type: String },
};

export default blockSchema;
export interface IBlockDocument extends Document, IBlock {}
