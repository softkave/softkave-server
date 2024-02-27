import assert = require('assert');
import {CollaborationRequestStatusType} from '../../../mongo/collaboration-request/definitions';
import {containsEveryItemIn} from '../../testUtils/assertion/list';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestCollaborationRequestWithEndpoint} from '../../testUtils/setups/setupTestCollaborationRequestWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import respondToRequest from '../respondToRequest/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(respondToRequest, context);

afterAll(async () => {
  await context.close();
});

describe('respond to request', () => {
  test('request accepted', async () => {
    const user01 = await setupTestUser(context);
    const user02 = await setupTestUser(context);
    const req01 = setupTestExpressRequestWithToken({token: user01.token});
    const req02 = setupTestExpressRequestWithToken({token: user02.token});
    const {organization} = await setupTestOrganizationWithEndpoint(context, req01.req);
    const {requests} = await setupTestCollaborationRequestWithEndpoint(
      context,
      req01.req,
      organization.customId,
      [{email: user02.user.email}]
    );

    const result = await endpoint(
      {
        requestId: requests[0].customId,
        response: CollaborationRequestStatusType.Accepted,
      },
      req02.req
    );

    assertResultOk(result);
    assert(result);
    expect(result.organization?.customId).toEqual(organization.customId);
    expect(result.respondedAt).toBeTruthy();
    const request = await context.collaborationRequest.assertGetCollaborationRequestById(
      context,
      requests[0].customId
    );

    expect(request.statusHistory[request.statusHistory.length - 1]).toMatchObject({
      status: CollaborationRequestStatusType.Accepted,
    });

    const user02FromDb = await context.user.assertGetUserById(context, user02.user.customId);
    containsEveryItemIn(
      user02FromDb.workspaces,
      [{customId: organization.customId}],
      item => item.customId
    );
  });

  test('request declined', async () => {
    const user01 = await setupTestUser(context);
    const user02 = await setupTestUser(context);
    const req01 = setupTestExpressRequestWithToken({token: user01.token});
    const req02 = setupTestExpressRequestWithToken({token: user02.token});
    const {organization} = await setupTestOrganizationWithEndpoint(context, req01.req);
    const {requests} = await setupTestCollaborationRequestWithEndpoint(
      context,
      req01.req,
      organization.customId,
      [{email: user02.user.email}]
    );

    const result = await endpoint(
      {
        requestId: requests[0].customId,
        response: CollaborationRequestStatusType.Declined,
      },
      req02.req
    );

    assertResultOk(result);
    const request = await context.collaborationRequest.assertGetCollaborationRequestById(
      context,
      requests[0].customId
    );

    expect(request.statusHistory[request.statusHistory.length - 1]).toMatchObject({
      status: CollaborationRequestStatusType.Declined,
    });
  });
});
