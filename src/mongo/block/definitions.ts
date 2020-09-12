import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

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
    updatedBy: { type: String },
    updatedAt: { type: Date },
};

export enum BlockType {
    Root = "root",
    Org = "org",
    Board = "board",
    Task = "task",
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

export interface IBlock {
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType;
    name?: string;
    lowerCasedName?: string;
    description?: string;
    dueAt?: Date;
    color?: string;
    updatedAt?: Date;
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
    statusAssignedAt?: Date;
    taskResolution?: string;
    labels?: IBlockAssignedLabel[];
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
}

const blockSchema = {
    customId: { type: String, unique: true, index: true },
    name: { type: String },
    lowerCasedName: { type: String, index: true },
    description: { type: String },
    dueAt: { type: Date },
    createdAt: { type: Date, default: () => getDate() },
    createdBy: { type: String },
    color: { type: String },
    updatedAt: { type: Date },
    updatedBy: { type: String },
    type: { type: String, index: true },
    parent: { type: String, index: true },
    rootBlockId: { type: String },
    assignees: { type: [blockAssigneeSchema] },
    priority: { type: String },
    subTasks: { type: [subTaskSchema] },
    boardStatuses: { type: [blockStatusSchema] },
    boardLabels: { type: [blockLabelSchema] },
    boardResolutions: { type: boardStatusResolutionSchema },
    status: { type: String },
    statusAssignedBy: { type: String },
    statusAssignedAt: { type: Date },
    taskResolution: { type: String },
    labels: { type: [blockAssignedLabelSchema] },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
};

export default blockSchema;
export interface IBlockDocument extends Document, IBlock {}
