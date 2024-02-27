import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestBoardWithEndpoint} from '../../testUtils/setups/setupTestBoardWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestTaskWithEndpoint} from '../../testUtils/setups/setupTestTaskWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import getBoardTasks from '../getBoardTasks/handler';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getBoardTasks, context);

afterAll(async () => {
  await context.close();
});

describe('get board tasks', () => {
  test('can get tasks', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization: org01} = await setupTestOrganizationWithEndpoint(context, req);
    const {board: board01} = await setupTestBoardWithEndpoint(context, req, org01.customId);
    const {task: task01} = await setupTestTaskWithEndpoint(
      context,
      req,
      org01.customId,
      board01.customId
    );

    const {task: task02} = await setupTestTaskWithEndpoint(
      context,
      req,
      org01.customId,
      board01.customId
    );

    const result = await endpoint({boardId: board01.customId}, req);
    assertResultOk(result);
    const resultTaskIdList = result.tasks.map(t => t.customId);
    const tasksIdList = [task01.customId, task02.customId];
    expect(resultTaskIdList).toEqual(expect.arrayContaining(tasksIdList));
    // expect(result?.tasks).toContainEqual(task01);
    // expect(result?.tasks).toContainEqual(task02);
  });
});
