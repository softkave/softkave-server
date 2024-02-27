import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicOrganization} from '../types';

export interface IGetOrganizationEndpointParameters {
  organizationId: string;
}

export interface IGetOrganizationEndpointResult {
  organization: IPublicOrganization;
}

export type GetOrganizationEndpoint = Endpoint<
  IBaseContext,
  IGetOrganizationEndpointParameters,
  IGetOrganizationEndpointResult
>;
