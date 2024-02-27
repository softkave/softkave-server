import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestBoardWithEndpoint} from '../../testUtils/setups/setupTestBoardWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import deleteBoard from '../deleteBoard/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(deleteBoard, context);

afterAll(async () => {
  await context.close();
});

describe('delete board', () => {
  test('can delete board', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization: org01} = await setupTestOrganizationWithEndpoint(context, req);
    const {board: board01} = await setupTestBoardWithEndpoint(context, req, org01.customId);
    const result = await endpoint({boardId: board01.customId}, req);
    assertResultOk(result);
    const board = await context.data.board.getOneByQuery(context, {
      customId: board01.customId,
    });
    expect(board).toBeFalsy();
  });
});
