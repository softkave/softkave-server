import {IResource, IWorkspaceResource} from '../models/resource';
import {SystemResourceType} from '../models/system';
import {getDate} from '../utilities/fns';
import {ensureMongoSchemaFields} from './utils';

export interface IParentInformation {
  type: SystemResourceType;
  customId: string;
}

export const parentSchema = ensureMongoSchemaFields<IParentInformation>({
  type: {type: String},
  customId: {type: String},
});

export const resourceSchema = ensureMongoSchemaFields<IResource>({
  customId: {type: String, unique: true, index: true},
  isDeleted: {type: Boolean, default: false, index: true},
  deletedAt: {type: Date},
  deletedBy: {type: String},
  createdAt: {type: Date, default: getDate},
  lastUpdatedAt: {type: Date},
});
export const workspaceResourceSchema = ensureMongoSchemaFields<IWorkspaceResource>({
  ...resourceSchema,
  workspaceId: {type: String, index: true},
  visibility: {type: String, index: true},
  createdBy: {type: String},
  lastUpdatedBy: {type: String},
});
