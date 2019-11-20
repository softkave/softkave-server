import { Document, SchemaTypeOpts } from "mongoose";

export interface ITaskCollaborator {
  userId: string;
  completedAt: number;
  assignedAt: number;
  assignedBy: string;
}

export const blockTaskCollaboratorsDataSchema = {
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

export const linkedBlocks = {
  blockId: String,
  reason: String,
  createdBy: String,
  createdAt: Number
};

export interface ISubTask {
  customId: string;
  description: string;
}

export const subTasks = {
  customId: String,
  description: String
};

export interface IBlock {
  customId: string;
  name: string;
  lowerCasedName: string;
  description: string;
  expectedEndAt: number;
  createdAt: number;
  color: string;
  updatedAt: number;
  type: string;
  parents: string[];
  createdBy: string;
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
  taskCollaborators: {
    type: [blockTaskCollaboratorsDataSchema],
    index: true
  },
  linkedBlocks: {
    type: [linkedBlocks]
  },
  subTasks: {
    type: [subTasks]
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