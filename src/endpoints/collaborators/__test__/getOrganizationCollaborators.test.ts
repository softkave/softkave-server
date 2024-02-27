import assert = require('assert');
import {containsEveryItemIn} from '../../testUtils/assertion/list';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestCollaboratorWithEndpoint} from '../../testUtils/setups/setupTestCollaboratorWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import getOrganizationCollaborators from '../getOrganizationCollaborators/handler';
import {getCollaboratorDataFromUser} from '../utils';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getOrganizationCollaborators, context);

afterAll(async () => {
  await context.close();
});

describe('get organization collaborators', () => {
  test('can get collaborators', async () => {
    const user01 = await setupTestUser(context);
    const user02 = await setupTestUser(context);
    const req01 = setupTestExpressRequestWithToken({token: user01.token});
    const {organization: org01} = await setupTestOrganizationWithEndpoint(context, req01.req);
    await setupTestCollaboratorWithEndpoint(
      context,
      req01.req,
      org01.customId,
      user02.user.email,
      user02.token
    );

    const result = await endpoint({organizationId: org01.customId}, req01.req);
    assertResultOk(result);
    assert(result);
    expect(result.collaborators).toHaveLength(2);
    containsEveryItemIn(
      result.collaborators,
      [getCollaboratorDataFromUser(user02.user)],
      item => item.customId
    );
  });
});
