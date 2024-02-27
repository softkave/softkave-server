import {SystemActionType, SystemResourceType} from '../../../models/system';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {getDeleteTaskPermQueries} from '../permissionQueries';
import {assertTask} from '../utils';
import {DeleteTaskEndpoint} from './types';
import {deleteTaskJoiSchema} from './validation';

const deleteTask: DeleteTaskEndpoint = async (ctx, d) => {
  const data = validate(d.data, deleteTaskJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const task = await ctx.data.task.getOneByQuery(ctx, {customId: data.taskId});
  assertTask(task);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: task.workspaceId,
    actionTarget: task,
    ...getDeleteTaskPermQueries(task),
  });

  await ctx.data.task.deleteOneByQuery(ctx, {customId: task.customId});
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(task.boardId), {
    actionType: SystemActionType.Delete,
    resourceType: SystemResourceType.Task,
    resource: {customId: task.customId},
  });
};

export default deleteTask;
