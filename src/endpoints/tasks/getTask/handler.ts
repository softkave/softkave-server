import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getReadTasksPermQueries} from '../permissionQueries';
import {assertTask, getPublicTaskData} from '../utils';
import {GetTaskEndpoint} from './types';
import {getTaskJoiSchema} from './validation';

const getTask: GetTaskEndpoint = async (ctx, d) => {
  const data = validate(d.data, getTaskJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const task = await ctx.data.task.getOneByQuery(ctx, {customId: data.taskId});
  assertTask(task);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: task.workspaceId,
    actionTarget: task,
    ...getReadTasksPermQueries(task.boardId, task.workspaceId),
  });

  return {task: getPublicTaskData(task)};
};

export default getTask;
