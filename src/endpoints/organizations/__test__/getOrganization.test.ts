import assert = require('assert');
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import getOrganization from '../getOrganization/handler';

const ctx = getTestBaseContext();
const endpoint = wrapEndpointREST(getOrganization, ctx);

afterAll(async () => {
  await ctx.close();
});

describe('get organization', () => {
  test('can get organization', async () => {
    const {token} = await setupTestUser(ctx);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization} = await setupTestOrganizationWithEndpoint(ctx, req);
    const result = await endpoint({organizationId: organization.customId}, req);
    assertResultOk(result);
    assert(result);
    expect(result?.organization.customId).toEqual(organization.customId);
  });
});
