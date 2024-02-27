import assert = require('assert');
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestCollaborationRequestWithEndpoint} from '../../testUtils/setups/setupTestCollaborationRequestWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import markRequestRead from '../markRequestRead/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(markRequestRead, context);

afterAll(async () => {
  await context.close();
});

describe('mark request read', () => {
  test('can mark request read', async () => {
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

    let request = await context.collaborationRequest.assertGetCollaborationRequestById(
      context,
      requests[0].customId
    );

    expect(request.readAt).toBeFalsy();
    const result = await endpoint({requestId: requests[0].customId}, req02.req);

    assertResultOk(result);
    assert(result);
    request = await context.collaborationRequest.assertGetCollaborationRequestById(
      context,
      result?.request.customId
    );

    expect(request.readAt).toBeTruthy();
  });
});
