import {indexByCustomId} from '../../../utilities/fns';
import {containsEveryItemIn} from '../../testUtils/assertion/list';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import getUserOrganizations from '../getUserOrganizations/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getUserOrganizations, context);

afterAll(async () => {
  await context.close();
});

describe('get user organizations', () => {
  test('can get organizations', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization: org01} = await setupTestOrganizationWithEndpoint(context, req);
    const {organization: org02} = await setupTestOrganizationWithEndpoint(context, req);

    const result = await endpoint(undefined, req);
    assertResultOk(result);
    containsEveryItemIn(result.organizations, [org01, org02], indexByCustomId);
  });
});
