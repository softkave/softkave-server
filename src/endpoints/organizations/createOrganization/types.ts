import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {INewOrganizationInput, IPublicOrganization} from '../types';

export interface ICreateOrganizationParameters {
  organization: INewOrganizationInput;
}

export interface ICreateOrganizationResult {
  organization: IPublicOrganization;
}

export type CreateOrganizationEndpoint = Endpoint<
  IBaseContext,
  ICreateOrganizationParameters,
  ICreateOrganizationResult
>;
