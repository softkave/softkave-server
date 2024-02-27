import {Connection} from 'mongoose';
import {IWorkspaceResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {workspaceResourceSchema} from '../definitions';
import {ensureMongoSchemaFields} from '../utils';

export interface ITaskAssignee {
  userId: string;
  assignedAt: Date;
  assignedBy: string;
}

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

export enum TaskPriority {
  Medium = 'medium',
  Low = 'low',
  High = 'high',
}

export interface ITaskAssignedLabel {
  labelId: string;
  assignedBy: string;
  assignedAt: Date;
}

export interface ITaskSprint {
  sprintId: string;
  assignedAt: Date;
  assignedBy: string;
}

export interface ITask extends IWorkspaceResource {
  name: string;
  description?: string;
  boardId: string;
  assignees: ITaskAssignee[];
  priority: string;
  subTasks: ISubTask[]; // should sub-tasks be their own blocks?
  status?: string;
  statusAssignedBy?: string;
  statusAssignedAt?: Date;
  taskResolution?: string;
  labels: ITaskAssignedLabel[];
  dueAt?: Date | string;
  taskSprint?: ITaskSprint | null;
}

const blockAssignedLabelSchema = ensureMongoSchemaFields<ITaskAssignedLabel>({
  labelId: {type: String},
  assignedBy: {type: String},
  assignedAt: {type: Date},
});
const taskSprintSchema = ensureMongoSchemaFields<ITaskSprint>({
  sprintId: {type: String},
  assignedAt: {type: Date},
  assignedBy: {type: String},
});
const blockAssigneeSchema = ensureMongoSchemaFields<ITaskAssignee>({
  userId: String,
  assignedAt: Date,
  assignedBy: String,
});
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
export const taskSchema = ensureMongoSchemaFields<ITask>({
  ...workspaceResourceSchema,
  name: {type: String},
  description: {type: String},
  boardId: {type: String, index: true},
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
});

const modelName = 'task_01';
const collectionName = 'tasks_01';
export const getTaskModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<ITask>({
      modelName,
      collectionName,
      rawSchema: taskSchema,
      connection: conn,
    });
  }
);

export type ITaskModel = MongoModel<ITask>;
