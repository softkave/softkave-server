import {TaskPriority} from '../../../mongo/block/task';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {chance} from '../../testUtils/data/data';
import {setupTestBoardWithEndpoint} from '../../testUtils/setups/setupTestBoardWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestTaskWithEndpoint} from '../../testUtils/setups/setupTestTaskWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {INewTaskInput} from '../types';
import {assertTask} from '../utils';

const context = getTestBaseContext();

afterAll(async () => {
  await context.close();
});

describe('create board', () => {
  test('can create board', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization} = await setupTestOrganizationWithEndpoint(context, req);
    const {board} = await setupTestBoardWithEndpoint(context, req, organization.customId);
    const input: INewTaskInput = {
      name: chance.sentence(),
      description: chance.sentence({words: 20}),
      boardId: board.customId,
      workspaceId: organization.customId,
      assignees: [],
      priority: TaskPriority.Medium,
      subTasks: [],
      labels: [],
    };

    const result = await setupTestTaskWithEndpoint(
      context,
      req,
      organization.customId,
      board.customId,
      input
    );

    expect(result?.task).toMatchObject(input);
    const task = await context.data.task.getOneByQuery(context, {customId: result?.task.customId});
    assertTask(task);
    expect(result?.task.customId).toEqual(task.customId);
  });
});
