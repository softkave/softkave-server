import {IPermissionGroupContainer} from '../../../mongo/access-control/permissionGroup';
import {
  IPermissionItem,
  IPermissionItemEntity,
  IPermissionItemTarget,
  SoftkavePermissionActions,
} from '../../../mongo/access-control/permissionItem';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IGetPermissionItemListEndpointParameters {
  organizationId: string;
  container: IPermissionGroupContainer;
  entity?: IPermissionItemEntity;
  target?: IPermissionItemTarget;
  action?: SoftkavePermissionActions;
  allow?: boolean;
}

export interface IGetPermissionItemListEndpointResult {
  permissionList: IPermissionItem[];
}

export type GetPermissionItemListEndpoint = Endpoint<
  IBaseContext,
  IGetPermissionItemListEndpointParameters,
  IGetPermissionItemListEndpointResult
>;
