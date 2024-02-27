import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicCollaborationRequest} from '../types';

export interface IMarkRequestReadParameters {
  requestId: string;
}

export interface IMarkRequestReadEndpointResult {
  request: IPublicCollaborationRequest;
}

export type MarkRequestReadEndpoint = Endpoint<
  IBaseContext,
  IMarkRequestReadParameters,
  IMarkRequestReadEndpointResult
>;
