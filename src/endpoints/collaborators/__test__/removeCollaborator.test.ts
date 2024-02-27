import {containsEveryItemIn} from '../../testUtils/assertion/list';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestCollaboratorWithEndpoint} from '../../testUtils/setups/setupTestCollaboratorWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import removeCollaborator from '../removeCollaborator/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(removeCollaborator, context);

afterAll(async () => {
  await context.close();
});

describe('remove collaborator', () => {
  test('can remove collaborator', async () => {
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

    let user02FromDb = await context.user.assertGetUserById(context, user02.user.customId);
    containsEveryItemIn(
      user02FromDb.workspaces,
      [{customId: org01.customId}],
      item => item.customId
    );
    const result = await endpoint(
      {
        organizationId: org01.customId,
        collaboratorId: user02.user.customId,
      },
      req01.req
    );

    assertResultOk(result);
    user02FromDb = await context.user.assertGetUserById(context, user02.user.customId);
    expect(user02FromDb.workspaces).not.toContainEqual({
      customId: org01.customId,
    });
  });
});
