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

// export interface IBlockRole {
//   roleName: string;
//   createdBy: string;
//   createdAt: number;
// }

// export const blockRoleSchema = {
//   roleName: String,
//   createdBy: String,
//   createdAt: String
// };

// export interface ILinkedBlock {
//   blockId: string;
//   reason: string;
//   createdBy: string;
//   createdAt: number;
// }

// export const linkedBlocksSchema = {
//   blockId: String,
//   reason: String,
//   createdBy: String,
//   createdAt: Number
// };

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

export interface ITaskCollaborationData {
  collaborationType: "individual" | "collective";
  completedAt?: number;
  completedBy?: string;
}

export const mongoTaskCollaborationDataSchema = {
  collaborationType: { type: String, default: "collective" }, // "individual" OR "collective"
  completedAt: Number,
  completedBy: String
};

export type BlockType = "root" | "org" | "project" | "group" | "task";
export type BlockLandingPage = "tasks" | "projects" | "self";

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

  parent: string; // - updated from string[]
  rootBlockID: string; // - new

  createdBy: string;

  // taskCollaborationType: ITaskCollaborationData; // - deprecated

  taskCollaborationData: ITaskCollaborationData;
  taskCollaborators: ITaskCollaborator[];
  priority: string;

  // isBacklog: boolean; // - deprecated

  // can we remove these fields and fetch the counts and the children using parent field instead
  tasks: string[];
  groups: string[];
  projects: string[];

  // can we consolidate all the groups?
  // like - groups: { customId: string, taskContext: number, projectContext: number }
  groupTaskContext: string[];
  groupProjectContext: string[];

  // roles: IBlockRole[]; // - deprecated for now

  subTasks: ISubTask[]; // - should sub-tasks be their own blocks?

  // labels: string[]; // - new

  landingPage?: BlockLandingPage;
}

// TODO: Define type for blockSchema and other mongo schemas
const blockSchema = {
  customId: { type: String, unique: true },
  name: {
    type: String,
    index: true
  },
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
  parent: {
    type: String,
    index: true
  },
  rootBlockID: {
    type: String
  },
  createdBy: {
    type: String,
    index: true
  },
  taskCollaborationData: mongoTaskCollaborationDataSchema,
  taskCollaborators: {
    type: [blockTaskCollaboratorDataSchema],
    index: true
  },
  subTasks: {
    type: [mongoSubTaskSchema]
  },
  priority: String,
  tasks: [String],
  groups: [String],
  projects: [String],
  groupTaskContext: [String],
  groupProjectContext: [String]
};

export default blockSchema;
export interface IBlockDocument extends Document, IBlock {}
