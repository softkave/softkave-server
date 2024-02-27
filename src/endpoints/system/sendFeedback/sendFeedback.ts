import { SystemActionType, SystemResourceType } from '../../../models/system';
import { IBoardStatus } from '../../../mongo/block/board';
import { ISubTask, ITask, TaskPriority } from '../../../mongo/block/task';
import { getDate } from '../../../utilities/fns';
import { getNewId02 } from '../../../utilities/ids';
import { validate } from '../../../utilities/joiUtils';
import { assertBoard } from '../../boards/utils';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import { getPublicTaskData } from '../../tasks/utils';
import { systemConstants } from '../constants';
import { SendFeedbackEndpoint } from './types';
import { sendFeedbackJoiSchema } from './validation';

// TODO: should we audit log this endpoint
const sendFeedback: SendFeedbackEndpoint = async (ctx, d) => {
  const data = validate(d.data, sendFeedbackJoiSchema);
  const user = await ctx.session.tryGetUser(ctx, d, /** allowAnonymousUsers */ true);
  const feedbackBoard = await ctx.data.board.getOneByQuery(ctx, {
    customId: ctx.appVariables.feedbackBoardId,
  });
  assertBoard(feedbackBoard);
  const statuses = feedbackBoard.boardStatuses || [];
  const status0: IBoardStatus | undefined = statuses[0];
  const subTasks: ISubTask[] = [];
  if (data.notifyEmail) {
    const email = data.notifyEmail;
    subTasks.push({
      customId: getNewId02(SystemResourceType.SubTask),
      description: `Reach out to "${email}" on progress of feedback or anything else`,
      createdAt: getDate(),
      createdBy: ctx.appVariables.feedbackUserId,
    });
  } else if (user) {
    subTasks.push({
      customId: getNewId02(SystemResourceType.SubTask),
      description: `User "${user.email}" sent this feedback, but do not notify`,
      createdAt: getDate(),
      createdBy: ctx.appVariables.feedbackUserId,
    });
  }

  // TODO: consolidate task creation and propagation into one function reused
  // by sendFeedback and createTask
  const task: ITask = {
    subTasks,
    customId: getNewId02(SystemResourceType.Task),
    name: data.feedback,
    description: data.description,
    boardId: feedbackBoard.customId,
    workspaceId: feedbackBoard.workspaceId,
    priority: TaskPriority.Medium,
    status: status0 ? status0.customId : undefined,
    statusAssignedBy: systemConstants.feedbackUserId,
    createdBy: ctx.appVariables.feedbackUserId,
    createdAt: getDate(),
    assignees: [],
    labels: [],
    visibility: 'organization',
  };

  await ctx.data.task.insertList(ctx, [task]);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(feedbackBoard.customId), {
    actionType: SystemActionType.Create,
    resourceType: SystemResourceType.Task,
    resource: getPublicTaskData(task),
  });
};

export default sendFeedback;
