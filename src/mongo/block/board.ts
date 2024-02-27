import {Connection} from 'mongoose';
import {IWorkspaceResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {workspaceResourceSchema} from '../definitions';
import {IBoardSprintOptions, boardSprintOptionsSchema} from '../sprint/definitions';
import {ensureMongoSchemaFields} from '../utils';

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

export interface IBoardStatusResolution {
  customId: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  description?: string;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface IBoard extends IWorkspaceResource {
  name: string;
  description?: string;
  color: string;
  boardStatuses: IBoardStatus[];
  boardLabels: IBoardLabel[];
  boardResolutions: IBoardStatusResolution[];
  currentSprintId?: string | null;
  sprintOptions?: IBoardSprintOptions;
  lastSprintId?: string | null;
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
export const boardStatusResolutionSchema = ensureMongoSchemaFields<IBoardStatusResolution>({
  customId: {type: String},
  name: {type: String},
  description: {type: String},
  createdBy: {type: String},
  createdAt: {type: Date},
  updatedBy: {type: String},
  updatedAt: {type: Date},
});
export const boardSchema = ensureMongoSchemaFields<IBoard>({
  ...workspaceResourceSchema,
  name: {type: String},
  description: {type: String},
  color: {type: String},
  boardStatuses: {type: [blockStatusSchema], default: []},
  boardLabels: {type: [blockLabelSchema], default: []},
  boardResolutions: {type: [boardStatusResolutionSchema], default: []},
  currentSprintId: {type: String},
  sprintOptions: {type: boardSprintOptionsSchema},
  lastSprintId: {type: String},
});

const modelName = 'board_01';
const collectionName = 'boards_01';
export const getBoardModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IBoard>({
      modelName,
      collectionName,
      rawSchema: boardSchema,
      connection: conn,
    });
  }
);

export type IBoardModel = MongoModel<IBoard>;
