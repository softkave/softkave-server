import { Document, SchemaTypeOpts } from "mongoose";

export interface ITaskCollaborator {
  userId: string;
  assignedAt: number;
  assignedBy: string;
  completedAt?: number;
}

export const blockTaskCollaboratorDataSchema = {
  userId: String,
  completedAt: Number,
  assignedAt: Number,
  assignedBy: String
};

export interface IBlockRole {
  roleName: string;
  createdBy: string;
  createdAt: number;
}

export const blockRoleSchema = {
  roleName: String,
  createdBy: String,
  createdAt: String
};

export interface ILinkedBlock {
  blockId: string;
  reason: string;
  createdBy: string;
  createdAt: number;
}

export const linkedBlocksSchema = {
  blockId: String,
  reason: String,
  createdBy: String,
  createdAt: Number
};

export interface ISubTask {
  customId: string;
  description: string;
  completedBy: string;
  completedAt: number;
}

export const mongoSubTaskSchema = {
  customId: String,
  description: String,
  completedBy: String,
  completedAt: Number
};

export const mongoTaskCollaborationDataSchema = {
  collaborationType: { type: String, default: "collective" }, // "individual" OR "collective"
  completedAt: Number,
  completedBy: String
};

export interface ITaskCollaborationData {
  collaborationType: "individual" | "collective";
  completedAt?: number;
  completedBy?: string;
}

export type BlockType = "root" | "org" | "project" | "group" | "task";

export interface IBlock {
  customId: string;
  name: string;
  lowerCasedName: string;
  description: string;
  expectedEndAt: number;
  createdAt: number;
  color: string;
  updatedAt: number;
  type: BlockType;
  parents: string[];
  createdBy: string;

  taskCollaborationType: ITaskCollaborationData; // deprecate

  taskCollaborationData: ITaskCollaborationData;
  taskCollaborators: ITaskCollaborator[];
  priority: string;
  isBacklog: boolean;
  tasks: string[];
  groups: string[];
  projects: string[];
  groupTaskContext: string[];
  groupProjectContext: string[];
  roles: IBlockRole[];
  subTasks: ISubTask[];
}

const blockSchema = {
  customId: { type: String, unique: true },
  name: {
    type: String,
    index: true
  },

  // TODO: Think on, should we retain lowercased names so that we can retain the
  // user formatting of the block name?
  // TODO: Define type for blockSchema and other mongo schemas
  lowerCasedName: {
    type: String,
    index: true,
    lowercase: true
  } as SchemaTypeOpts<StringConstructor>,
  description: String,
  expectedEndAt: Number,
  createdAt: {
    type: Number,
    default: Date.now
  },
  color: String,
  updatedAt: Number,
  type: {
    type: String,
    index: true,
    lowercase: true
  },
  parents: {
    type: [String],
    index: true
  },
  createdBy: {
    type: String,
    index: true
  },

  // deprecate
  taskCollaborationType: mongoTaskCollaborationDataSchema,

  taskCollaborationData: mongoTaskCollaborationDataSchema,
  taskCollaborators: {
    type: [blockTaskCollaboratorDataSchema],
    index: true
  },
  linkedBlocks: {
    type: [linkedBlocksSchema]
  },
  subTasks: {
    type: [mongoSubTaskSchema]
  },
  priority: String,
  isBacklog: Boolean,
  tasks: [String],
  groups: [String],
  projects: [String],
  groupTaskContext: [String],
  groupProjectContext: [String],
  roles: [blockRoleSchema]
};

export default blockSchema;
export interface IBlockDocument extends Document, IBlock {}
