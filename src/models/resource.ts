import {ObjectValues} from '../utilities/types';
import {SystemResourceType} from './system';

export interface IResourceWithDescriptor<T> {
  customId: string;
  type: SystemResourceType;
  data: T;
}

export const ResourceVisibilityMap = {
  Public: 'public',
  Workspace: 'workspace',
  Board: 'board',
  Private: 'private',
} as const;

export type ResourceVisibility = ObjectValues<typeof ResourceVisibilityMap>;

export interface IResource {
  customId: string;
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: Date | string;
  createdAt: Date | string;
  lastUpdatedAt?: Date | string;
}

export interface IWorkspaceResource extends IResource {
  workspaceId: string;
  visibility: ResourceVisibility;
  createdBy: string;
  lastUpdatedBy?: string;
}
