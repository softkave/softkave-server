import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IGetOrganizationUnseenChatsCountEndpointParams {
  orgId: string;
}

export interface IGetOrganizationUnseenChatsCountEndpointResult {
  count: number;
}

export type GetOrganizationUnseenChatsCountEndpoint = Endpoint<
  IBaseContext,
  IGetOrganizationUnseenChatsCountEndpointParams,
  IGetOrganizationUnseenChatsCountEndpointResult
>;
