import assert = require('assert');
import {containsEveryItemIn} from '../../testUtils/assertion/list';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestCollaborationRequestWithEndpoint} from '../../testUtils/setups/setupTestCollaborationRequestWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import getUserRequests from '../getUserRequests/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getUserRequests, context);

afterAll(async () => {
  await context.close();
});

describe('get user requests', () => {
  test('can get requests', async () => {
    const user01 = await setupTestUser(context);
    const user02 = await setupTestUser(context);
    const req01 = setupTestExpressRequestWithToken({token: user01.token});
    const req02 = setupTestExpressRequestWithToken({token: user02.token});
    const {organization} = await setupTestOrganizationWithEndpoint(context, req01.req);

    await setupTestCollaborationRequestWithEndpoint(context, req01.req, organization.customId, [
      {email: user02.user.email},
    ]);

    const result = await endpoint(undefined, req02.req);
    assertResultOk(result);
    assert(result);
    expect(result.requests).toHaveLength(1);
    containsEveryItemIn(result.requests, [{to: {email: user02.user.email}}], item => item.to.email);
  });
});
