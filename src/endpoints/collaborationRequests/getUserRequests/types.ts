import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicCollaborationRequest} from '../types';

export interface IGetUserRequestsResult {
  requests: IPublicCollaborationRequest[];
}

export type GetUserRequestsEndpoint = Endpoint<IBaseContext, undefined, IGetUserRequestsResult>;
