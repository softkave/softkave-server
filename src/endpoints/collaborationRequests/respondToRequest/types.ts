import {CollaborationRequestResponse} from '../../../mongo/collaboration-request/definitions';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IPublicOrganization} from '../../organizations/types';
import {Endpoint} from '../../types';
import {IPublicCollaborationRequest} from '../types';

export interface IRespondToCollaborationRequestParameters {
  requestId: string;
  response: CollaborationRequestResponse;
}
export interface IRespondToCollaborationRequestResult {
  organization?: IPublicOrganization;
  respondedAt: string;
  request: IPublicCollaborationRequest;
}

export type RespondToCollaborationRequestEndpoint = Endpoint<
  IBaseContext,
  IRespondToCollaborationRequestParameters,
  IRespondToCollaborationRequestResult
>;
