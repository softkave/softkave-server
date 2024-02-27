import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IWorkspaceExistsParameters {
  name: string;
}

export interface IWorkspaceExistsResult {
  exists: boolean;
}

export type OrganizationExistsEndpoint = Endpoint<
  IBaseContext,
  IWorkspaceExistsParameters,
  IWorkspaceExistsResult
>;
