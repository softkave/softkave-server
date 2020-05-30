import { Document, SchemaTypeOpts } from "mongoose";

export const blockSchemaVersion = 3; // increment when you make changes that are not backward compatible

export interface ITaskCollaborator0 {
  userId: string;
  assignedAt: number;
  assignedBy: string;
  completedAt?: number; // remove
}

export interface ITaskCollaborator {
  userId: string;
  assignedAt: string;
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
  assignedAt: String,
  assignedBy: String,
};

export interface ISubTask {
  customId: string;
  description: string;
  createdAt: string;
  createdBy: string;
  completedBy?: string;
  completedAt?: string;
}

export const subTaskSchema = {
  customId: String,
  description: String,
  createdAt: String,
  createdBy: String,
  completedBy: String,
  completedAt: String,
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
  createdAt: string;
  description?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export const blockLabelSchema = {
  customId: { type: String },
  name: { type: String },
  color: { type: String },
  description: { type: String },
  createdBy: { type: String },
  createdAt: { type: String },
  updatedBy: { type: String },
  updatedAt: { type: String },
};

export interface IBlockStatus {
  customId: string;
  name: string;
  color: string;
  description?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export const blockStatusSchema = {
  customId: { type: String },
  name: { type: String },
  description: { type: String },
  color: { type: String },
  createdBy: { type: String },
  createdAt: { type: String },
  updatedBy: { type: String },
  updatedAt: { type: String },
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
  taskCollaborators: ITaskCollaborator[];

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
  assignedAt: string;
}

export const blockAssignedLabelSchema = {
  customId: { type: String },
  assignedBy: { type: String },
  assignedAt: { type: String },
};

export interface IBlock {
  customId: string;
  createdBy: string;
  createdAt: string;
  type: BlockType;
  name?: string;
  lowerCasedName?: string;
  description?: string;
  dueAt?: string;
  color?: string;
  updatedAt?: string;
  updatedBy?: string;
  parent?: string;
  rootBlockId?: string;
  assignees?: ITaskCollaborator[];
  priority?: string;
  subTasks?: ISubTask[]; // should sub-tasks be their own blocks?
  boardStatuses?: IBlockStatus[];
  boardLabels?: IBlockLabel[];
  status?: string;
  statusAssignedBy?: string;
  statusAssignedAt?: string;
  labels?: IBlockAssignedLabel[];
  isDeleted?: boolean;
  deletedAt?: string;
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
  customId: { type: String, unique: true },
  name: { type: String },
  lowerCasedName: { type: String },
  description: { type: String },
  dueAt: { type: String },
  createdAt: { type: String },
  createdBy: { type: String },
  color: { type: String },
  updatedAt: { type: String },
  updatedBy: { type: String },
  type: { type: String },
  parent: { type: String },
  level: { type: Number },
  rootBlockId: { type: String },
  assignees: { type: [blockAssigneeSchema] },
  priority: { type: String },
  subTasks: { type: [subTaskSchema] },
  boardStatuses: { type: [blockStatusSchema] },
  boardLabels: { type: [blockLabelSchema] },
  status: { type: String },
  statusAssignedBy: { type: String },
  statusAssignedAt: Number,
  labels: { type: [blockAssignedLabelSchema] },
  isDeleted: { type: Boolean },
  deletedAt: { type: String },
  deletedBy: { type: String },
};

export default blockSchema;
export interface IBlockDocument extends Document, IBlock {}
