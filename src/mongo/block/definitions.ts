import {getDate} from '../../utilities/fns';
import {IBoardSprintOptions, boardSprintOptionsSchema} from '../sprint/definitions';
import {ensureMongoSchemaFields} from '../utils';

export const blockSchemaV4 = 4;

export interface ITaskAssignee {
  userId: string;
  assignedAt: Date;
  assignedBy: string;
}

export const blockAssigneeSchema = ensureMongoSchemaFields<ITaskAssignee>({
  userId: String,
  assignedAt: Date,
  assignedBy: String,
});

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

export const subTaskSchema = ensureMongoSchemaFields<ISubTask>({
  customId: String,
  description: String,
  createdAt: Date,
  createdBy: String,
  updatedAt: Date,
  updatedBy: String,
  completedBy: String,
  completedAt: Date,
});

export interface IBoardLabel {
  customId: string;
  name: string;
  color: string;
  createdBy: string;
  createdAt: Date;
  description?: string;
  updatedBy?: string;
  updatedAt?: Date;
}

export const blockLabelSchema = ensureMongoSchemaFields<IBoardLabel>({
  customId: {type: String},
  name: {type: String},
  color: {type: String},
  description: {type: String},
  createdBy: {type: String},
  createdAt: {type: Date},
  updatedBy: {type: String},
  updatedAt: {type: Date},
});

export interface IBoardStatus {
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

export const blockStatusSchema = ensureMongoSchemaFields<IBoardStatus>({
  customId: {type: String},
  name: {type: String},
  description: {type: String},
  color: {type: String},
  createdBy: {type: String},
  createdAt: {type: Date},
  position: {type: Number},
  updatedBy: {type: String},
  updatedAt: {type: Date},
});

export enum BlockType {
  Root = 'root',
  Organization = 'org',
  Board = 'board',
  Task = 'task',
}

export enum TaskPriority {
  Medium = 'medium',
  Low = 'low',
  High = 'high',
}

export interface ITaskAssignedLabel {
  customId: string;
  assignedBy: string;
  assignedAt: Date;
}

export const blockAssignedLabelSchema = ensureMongoSchemaFields<ITaskAssignedLabel>({
  customId: {type: String},
  assignedBy: {type: String},
  assignedAt: {type: Date},
});

export interface IBoardStatusResolution {
  customId: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  description?: string;
  updatedBy?: string;
  updatedAt?: Date;
}

export const boardStatusResolutionSchema = ensureMongoSchemaFields<IBoardStatusResolution>({
  customId: {type: String},
  name: {type: String},
  description: {type: String},
  createdBy: {type: String},
  createdAt: {type: Date},
  updatedBy: {type: String},
  updatedAt: {type: Date},
});

export interface ITaskSprint {
  sprintId: string;
  assignedAt: Date;
  assignedBy: string;
}

export const taskSprintSchema = ensureMongoSchemaFields<ITaskSprint>({
  sprintId: {type: String},
  assignedAt: {type: Date},
  assignedBy: {type: String},
});

export interface IBlock {
  // General
  createdBy: string;
  createdAt: Date;
  type: BlockType;
  name?: string;
  description?: string;
  updatedAt?: Date;
  updatedBy?: string;
  parent?: string;
  rootBlockId?: string;
  permissionResourceId?: string;

  // Organizations and boards
  color?: string;
  publicPermissionGroupId?: string;

  // Tasks
  assignees?: Array<ITaskAssignee>;
  priority?: string;
  subTasks?: Array<ISubTask>; // should sub-tasks be their own blocks?
  status?: string;
  statusAssignedBy?: string;
  statusAssignedAt?: Date;
  taskResolution?: string;
  labels?: Array<ITaskAssignedLabel>;
  dueAt?: Date;
  taskSprint?: ITaskSprint | null;

  // Boards
  boardStatuses?: Array<IBoardStatus>;
  boardLabels?: Array<IBoardLabel>;
  boardResolutions?: Array<IBoardStatusResolution>;
  currentSprintId?: string;
  sprintOptions?: IBoardSprintOptions;
  lastSprintId?: string;

  customId: string;
  isDeleted: boolean;
  deletedAt?: string | Date;
  deletedBy?: string;
}

const blockSchema = ensureMongoSchemaFields<IBlock>({
  // General
  customId: {type: String, unique: true, index: true},
  name: {type: String},
  description: {type: String},
  createdAt: {type: Date, default: () => getDate()},
  createdBy: {type: String},
  updatedAt: {type: Date},
  updatedBy: {type: String},
  type: {type: String, index: true},
  parent: {type: String, index: true},
  rootBlockId: {type: String},
  isDeleted: {type: Boolean, default: false, index: true},
  deletedAt: {type: Date},
  deletedBy: {type: String},
  permissionResourceId: {type: String},

  // Organizations and boards
  color: {type: String},
  publicPermissionGroupId: {type: String},

  // Tasks
  assignees: {type: [blockAssigneeSchema], default: []},
  priority: {type: String},
  subTasks: {type: [subTaskSchema], default: []},
  dueAt: {type: Date},
  status: {type: String},
  statusAssignedBy: {type: String},
  statusAssignedAt: {type: Date},
  taskResolution: {type: String},
  labels: {type: [blockAssignedLabelSchema], default: []},
  taskSprint: {type: taskSprintSchema},

  // Boards
  boardStatuses: {type: [blockStatusSchema], default: []},
  boardLabels: {type: [blockLabelSchema], default: []},
  boardResolutions: {type: [boardStatusResolutionSchema], default: []},
  currentSprintId: {type: String},
  sprintOptions: {type: boardSprintOptionsSchema},
  lastSprintId: {type: String},
});

export default blockSchema;
