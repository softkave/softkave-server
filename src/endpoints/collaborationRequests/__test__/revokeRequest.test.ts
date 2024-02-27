import assert = require('assert');
import {CollaborationRequestStatusType} from '../../../mongo/collaboration-request/definitions';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestCollaborationRequestWithEndpoint} from '../../testUtils/setups/setupTestCollaborationRequestWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import {makeRevokeRequestContext} from '../revokeRequest/context';
import revokeRequest from '../revokeRequest/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(revokeRequest, makeRevokeRequestContext(context));

afterAll(async () => {
  await context.close();
});

describe('revoke request', () => {
  test('can revoke request', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization} = await setupTestOrganizationWithEndpoint(context, req);
    const {requests} = await setupTestCollaborationRequestWithEndpoint(
      context,
      req,
      organization.customId
    );

    const result = await endpoint(
      {
        organizationId: organization.customId,
        requestId: requests[0].customId,
      },
      req
    );

    assertResultOk(result);
    assert(result);
    const request = await context.collaborationRequest.assertGetCollaborationRequestById(
      context,
      result?.request.customId
    );

    expect(request.statusHistory[request.statusHistory.length - 1]).toMatchObject({
      status: CollaborationRequestStatusType.Revoked,
    });
  });
});
