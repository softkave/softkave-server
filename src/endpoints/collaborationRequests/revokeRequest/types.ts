import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import sendCollaborationRequestRevokedEmail from '../sendCollaborationRequestRevokedEmail';
import {IPublicCollaborationRequest} from '../types';

export interface IRevokeCollaborationRequestParameters {
  requestId: string;
  organizationId: string;
}

export interface IRevokeCollaborationRequestContext extends IBaseContext {
  sendCollaborationRequestRevokedEmail: typeof sendCollaborationRequestRevokedEmail;
}

export type RevokeCollaborationRequestsEndpoint = Endpoint<
  IRevokeCollaborationRequestContext,
  IRevokeCollaborationRequestParameters,
  {request: IPublicCollaborationRequest}
>;
