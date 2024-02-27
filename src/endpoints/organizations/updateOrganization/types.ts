import {ResourceVisibility} from '../../../models/resource';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicOrganization} from '../types';

export interface IUpdateOrganizationInput {
  name?: string;
  description?: string;
  color?: string;
  visibility?: ResourceVisibility;
}

export interface IUpdateOrganizationParameters {
  organizationId: string;
  data: IUpdateOrganizationInput;
}

export interface IUpdateOrganizationResult {
  organization: IPublicOrganization;
}

export type UpdateOrganizationEndpoint = Endpoint<
  IBaseContext,
  IUpdateOrganizationParameters,
  IUpdateOrganizationResult
>;
