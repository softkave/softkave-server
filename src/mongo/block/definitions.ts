import { Document, SchemaTypeOpts } from "mongoose";
import { getDate } from "../../utilities/fns";

export const blockSchemaVersion = 3; // increment when you make changes that are not backward compatible

export interface ITaskCollaborator0 {
  userId: string;
  assignedAt: number;
  assignedBy: string;
  completedAt?: number; // remove
}

export interface IAssignee {
  userId: string;
  assignedAt: Date;
  assignedBy: string;
}

export const blockTaskCollaboratorDataSchema0 = {
  userId: String,
  completedAt: Number, // remove
  assignedAt: Number,
  assignedBy: String,
};

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

export interface ITaskCollaborationType {
  collaborationType: "individual" | "collective";
  completedAt?: number;
  completedBy?: string;
}

export const mongoTaskCollaborationDataSchema = {
  collaborationType: { type: String, default: "collective" }, // "individual" OR "collective"
  completedAt: Number,
  completedBy: String,
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
  description?: string;
  createdBy?: string;
  createdAt?: Date;
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

export type BlockType0 = "root" | "org" | "project" | "group" | "task";
export type BlockLandingPage = "tasks" | "boards" | "self";
export type BlockGroupContext = "groupTaskContext" | "groupProjectContext";

export enum BlockType {
  Root = "root",
  Org = "org",
  Board = "board",
  Task = "task",
}

export interface IBlock0 {
  customId: string;
  name: string;
  lowerCasedName: string;
  description: string;
  expectedEndAt: number;

  // dueAt: string;

  createdAt: number;
  color: string;
  updatedAt: number;
  type: BlockType0;

  parent: string;

  // org and project are the only board-able block types for now
  boardId: string; // pointer to the org or project the block is a child of
  rootBlockID: string;

  // rootBlockId: string;

  createdBy: string;

  // taskCollaborationType: ITaskCollaborationData; // - deprecated

  taskCollaborationData: ITaskCollaborationType; // remove
  taskCollaborators: IAssignee[];

  // collaborationType: ITaskCollaborationType;
  // assignees: ITaskCollaborator[];

  priority: string;

  // isBacklog: boolean; // - deprecated

  // can we remove these fields and fetch the counts and the children using parent field instead
  tasks: string[]; // remove
  groups: string[]; // remove
  projects: string[]; // remove

  // can we consolidate all the groups?
  // like - groups: { customId: String, taskContext: number, projectContext: number }
  groupTaskContext: string[];
  groupProjectContext: string[];

  // groupsOrder: string[];

  // roles: IBlockRole[]; // - deprecated for now

  subTasks: ISubTask[]; // - should sub-tasks be their own blocks?

  availableStatus?: IBlockStatus[];
  availableLabels?: IBlockLabel[];

  status?: string;
  statusAssignedBy?: string;
  statusAssignedAt?: number;

  labels?: string[];
  // add who and when to labels
  // TODO: how should we track change, in resource, in a different model, or partly in both?

  landingPage?: BlockLandingPage; // remove

  // isDeleted?: boolean;
  // deletedAt?: string;
  // deletedBy?: string;
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
  status?: string;
  statusAssignedBy?: string;
  statusAssignedAt?: Date;
  labels?: IBlockAssignedLabel[];
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

// TODO: Define type for blockSchema and other mongo schemas
export const blockSchema0 = {
  customId: { type: String, unique: true },
  name: {
    type: String,
    index: true,
  },
  lowerCasedName: {
    type: String,
    index: true,
    lowercase: true,
  } as SchemaTypeOpts<StringConstructor>,
  description: String,
  expectedEndAt: Number,
  createdAt: {
    type: Number,
    default: Date.now,
  },
  color: String,
  updatedAt: Number,
  type: {
    type: String,
    index: true,
    lowercase: true,
  },
  parent: {
    type: String,
    index: true,
  },
  rootBlockID: {
    type: String,
  },
  boardId: {
    type: String,
  },
  createdBy: {
    type: String,
    index: true,
  },
  taskCollaborationData: mongoTaskCollaborationDataSchema,
  taskCollaborators: {
    type: [blockAssigneeSchema],
    index: true,
  },
  subTasks: {
    type: [subTaskSchema],
  },
  priority: String,
  tasks: [String],
  groups: [String],
  projects: [String],
  groupTaskContext: [String],
  groupProjectContext: [String],
  landingPage: String,
  availableLabels: [blockLabelSchema],
  availableStatus: [blockStatusSchema],
  status: { type: String },
  labels: { type: [String] },
};

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
  status: { type: String },
  statusAssignedBy: { type: String },
  statusAssignedAt: { type: Date },
  labels: { type: [blockAssignedLabelSchema] },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date },
  deletedBy: { type: String },
};

export default blockSchema;
export interface IBlockDocument extends Document, IBlock {}
