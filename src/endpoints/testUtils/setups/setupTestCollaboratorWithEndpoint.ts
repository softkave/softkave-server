import * as assert from 'assert';
import {CollaborationRequestStatusType} from '../../../mongo/collaboration-request/definitions';
import {IToken} from '../../../mongo/token/definitions';
import RequestData from '../../RequestData';
import {makeAddCollaboratorContext} from '../../collaborationRequests/addCollaborators/context';
import addCollaborators from '../../collaborationRequests/addCollaborators/handler';
import {IAddCollaboratorsParameters} from '../../collaborationRequests/addCollaborators/types';
import respondToRequest from '../../collaborationRequests/respondToRequest/handler';
import {IRespondToCollaborationRequestParameters} from '../../collaborationRequests/respondToRequest/types';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IServerRequest} from '../../contexts/types';
import {assertResultOk} from '../utils';
import {setupTestExpressRequestWithToken} from './setupTestExpressRequest';

export async function setupTestCollaboratorWithEndpoint(
  context: IBaseContext,
  req: IServerRequest,
  orgId: string,
  email: string,
  token: IToken
) {
  const result01 = await addCollaborators(
    makeAddCollaboratorContext(context),
    RequestData.fromExpressRequest<IAddCollaboratorsParameters>(context, req, {
      organizationId: orgId,
      collaborators: [{email}],
    })
  );

  assertResultOk(result01);
  assert(result01);
  assert.ok(result01.requests);
  const result02 = await respondToRequest(
    context,
    RequestData.fromExpressRequest<IRespondToCollaborationRequestParameters>(
      context,
      setupTestExpressRequestWithToken({token}).req,
      {
        requestId: result01.requests[0].customId,
        response: CollaborationRequestStatusType.Accepted,
      }
    )
  );

  assertResultOk(result02);
}
