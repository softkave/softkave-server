import assert = require('assert');
import {containsEveryItemIn} from '../../testUtils/assertion/list';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestCollaborationRequestWithEndpoint} from '../../testUtils/setups/setupTestCollaborationRequestWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import getOrganizationRequests from '../getOrganizationRequests/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getOrganizationRequests, context);

afterAll(async () => {
  await context.close();
});

describe('get organization requests', () => {
  test('can get requests', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization} = await setupTestOrganizationWithEndpoint(context, req);
    const {requests} = await setupTestCollaborationRequestWithEndpoint(
      context,
      req,
      organization.customId
    );

    const result = await endpoint({organizationId: organization.customId}, req);
    assertResultOk(result);
    assert(result);
    expect(result.requests).toHaveLength(requests.length);
    // const orgRequestsMap = indexArray(result.requests, {path: 'customId'});
    // requests.forEach(item => {
    //   expect(orgRequestsMap[item.customId]).toBeTruthy();
    // });
    containsEveryItemIn(result.requests, requests, item => item.customId);
  });
});
