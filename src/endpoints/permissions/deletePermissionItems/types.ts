import {
  IPermissionItemEntity,
  IPermissionItemTarget,
  SoftkavePermissionActions,
} from '../../../mongo/access-control/permissionItem';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IDeletePermissionItemInput {
  entity?: IPermissionItemEntity;
  action?: SoftkavePermissionActions;
  target?: IPermissionItemTarget;
  allow?: boolean;
}

export interface IDeletePermissionItemsEndpointParameters {
  organizationId: string;
  items: IDeletePermissionItemInput[];
}

export type DeletePermissionItemsEndpoint = Endpoint<
  IBaseContext,
  IDeletePermissionItemsEndpointParameters
>;
