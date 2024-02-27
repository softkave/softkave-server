import {Connection, Document} from 'mongoose';
import {IWorkspaceResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getDate} from '../../utilities/fns';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {workspaceResourceSchema} from '../definitions';
import {ensureMongoSchemaFields} from '../utils';

export enum SprintDuration {
  OneWeek = '1 week',
  TwoWeeks = '2 weeks',
  OneMonth = '1 month',
}

export interface IBoardSprintOptions {
  duration: SprintDuration;
  updatedAt?: Date;
  updatedBy?: string;
  createdAt: Date;
  createdBy: string;
}

export interface ISprint extends IWorkspaceResource {
  boardId: string;
  duration: SprintDuration;
  name: string;
  sprintIndex: number;
  prevSprintId?: string | null;
  nextSprintId?: string | null;
  startDate?: Date;
  startedBy?: string;
  endDate?: Date;
  endedBy?: string;
}

export const boardSprintOptionsSchema = ensureMongoSchemaFields<IBoardSprintOptions>({
  duration: {type: String},
  createdAt: {type: Date, default: getDate},
  createdBy: {type: String},
  updatedAt: {type: Date},
  updatedBy: {type: String},
});
const sprintSchema = ensureMongoSchemaFields<ISprint>({
  ...workspaceResourceSchema,
  boardId: {type: String},
  duration: {type: String},
  prevSprintId: {type: String},
  nextSprintId: {type: String},
  sprintIndex: {type: Number},
  name: {type: String},
  startDate: {type: Date},
  startedBy: {type: String},
  endDate: {type: Date},
  endedBy: {type: String},
});

export interface ISprintDocument extends ISprint, Document {}
export type ISprintModel = MongoModel<ISprintDocument>;

const modelName = 'sprint_01';
const collectionName = 'sprints_01';

export const getSprintModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<ISprintDocument>({
      modelName,
      collectionName,
      rawSchema: sprintSchema,
      connection: conn,
    });
  }
);
