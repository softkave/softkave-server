import assert = require('assert');
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {chance} from '../../testUtils/data/data';
import {setupTestBoardWithEndpoint} from '../../testUtils/setups/setupTestBoardWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestTaskWithEndpoint} from '../../testUtils/setups/setupTestTaskWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import {makeUpdateTaskContext} from '../updateTask/context';
import updateTask from '../updateTask/handler';
import {IUpdateTaskInput} from '../updateTask/types';

/**
 * TODO:
 * - Test that context functions are called
 */

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(updateTask, makeUpdateTaskContext(context));

afterAll(async () => {
  await context.close();
});

describe('update task', () => {
  test('can update task', async () => {
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

    const input: IUpdateTaskInput = {
      name: chance.sentence(),
      description: chance.sentence({words: 18}),
      boardId: board02.customId,
    };

    const result = await endpoint({taskId: task01.customId, data: input}, req);
    assertResultOk(result);
    assert(result);
    expect(result.task).toMatchObject(input);
    const task = await context.data.task.getOneByQuery(context, {customId: result?.task.customId});
    expect(task).toMatchObject(input);
  });
});
