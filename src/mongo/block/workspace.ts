import {Connection} from 'mongoose';
import {IWorkspaceResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {workspaceResourceSchema} from '../definitions';
import {ensureMongoSchemaFields} from '../utils';

export interface IWorkspace extends IWorkspaceResource {
  name: string;
  description?: string;
  color: string;
  publicPermissionGroupId?: string;
}

export const workspaceSchema = ensureMongoSchemaFields<IWorkspace>({
  ...workspaceResourceSchema,
  name: {type: String},
  description: {type: String},
  color: {type: String},
  publicPermissionGroupId: {type: String},
});

const modelName = 'workspace_01';
const collectionName = 'workspaces_01';
export const getWorkspaceModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IWorkspace>({
      modelName,
      collectionName,
      rawSchema: workspaceSchema,
      connection: conn,
    });
  }
);

export type IWorkspaceModel = MongoModel<IWorkspace>;
