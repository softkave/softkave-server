import * as assert from 'assert';
import {TaskPriority} from '../../../mongo/block/task';
import RequestData from '../../RequestData';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IServerRequest} from '../../contexts/types';
import createTask from '../../tasks/createTask/handler';
import {ICreateTaskParameters} from '../../tasks/createTask/types';
import {INewTaskInput} from '../../tasks/types';
import {chance} from '../data/data';
import {assertResultOk} from '../utils';

export async function setupTestTaskWithEndpoint(
  context: IBaseContext,
  req: IServerRequest,
  orgId: string,
  boardId: string,
  base: Partial<INewTaskInput> = {}
) {
  const result = await createTask(
    context,
    RequestData.fromExpressRequest<ICreateTaskParameters>(context, req, {
      task: {
        boardId,
        name: chance.sentence(),
        description: chance.sentence({words: 30}),
        workspaceId: orgId,
        assignees: [],
        priority: TaskPriority.Medium,
        subTasks: [],
        labels: [],
        ...base,
      },
    })
  );

  assertResultOk(result);
  assert(result);
  assert.ok(result.task);
  return {
    task: result.task,
  };
}
