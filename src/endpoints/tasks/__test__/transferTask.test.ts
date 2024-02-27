import assert = require('assert');
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestBoardWithEndpoint} from '../../testUtils/setups/setupTestBoardWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestTaskWithEndpoint} from '../../testUtils/setups/setupTestTaskWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import transferTask from '../transferTask/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(transferTask, context);

afterAll(async () => {
  await context.close();
});

describe('transfer task', () => {
  test('can transfer task', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization: org01} = await setupTestOrganizationWithEndpoint(context, req);
    const {board: board01} = await setupTestBoardWithEndpoint(context, req, org01.customId);
    const {board: board02} = await setupTestBoardWithEndpoint(context, req, org01.customId);
    const {task: task01} = await setupTestTaskWithEndpoint(
      context,
      req,
      org01.customId,
      board01.customId
    );

    const result = await endpoint({taskId: task01.customId, boardId: board02.customId}, req);
    assertResultOk(result);
    assert(result);
    const taskParentId = result?.task?.boardId;
    assert(taskParentId);
    expect(taskParentId).toEqual(board02.customId);
  });
});
