import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {chance} from '../../testUtils/data/data';
import {setupTestBoardWithEndpoint} from '../../testUtils/setups/setupTestBoardWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import boardExists from '../boardExists/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(boardExists, context);

afterAll(async () => {
  await context.close();
});

describe('board exists', () => {
  test('returns true if board exists', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const boardName = chance.company();
    const {organization} = await setupTestOrganizationWithEndpoint(context, req);
    await setupTestBoardWithEndpoint(context, req, organization.customId, {
      name: boardName,
    });

    const result = await endpoint({name: boardName, parent: organization.customId}, req);
    assertResultOk(result);
    expect(result?.exists).toBeTruthy();
  });

  test('returns false if board does not exist', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization} = await setupTestOrganizationWithEndpoint(context, req);
    const result = await endpoint({name: chance.company(), parent: organization.customId}, req);
    assertResultOk(result);
    expect(result?.exists).toBeFalsy();
  });
});
