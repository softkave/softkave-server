import { SystemActionType, SystemResourceType } from "../../../models/system";
import {
  BlockPriority,
  BlockType,
  IBlockStatus,
  ISubTask,
} from "../../../mongo/block";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { ITask } from "../../task/types";
import { getPublicTaskData } from "../../task/utils";
import { systemConstants } from "../constants";
import { SendFeedbackEndpoint } from "./types";
import { sendFeedbackJoiSchema } from "./validation";

const sendFeedback: SendFeedbackEndpoint = async (context, instData) => {
  const data = validate(instData.data, sendFeedbackJoiSchema);
  const user = await context.session.tryGetUser(context, instData);
  const feedbackBoard = await context.block.getBlockById(
    context,
    context.appVariables.feedbackBoardId
  );

  const statuses = feedbackBoard.boardStatuses || [];
  const status0: IBlockStatus | undefined = statuses[0];
  const subTasks: ISubTask[] = [];

  if (data.notifyEmail) {
    const email = data.notifyEmail;
    subTasks.push({
      customId: getNewId(),
      description: `Reach out to "${email}" on progress of feedback or anything else.`,
      createdAt: getDate(),
      createdBy: context.appVariables.feedbackUserId,
    });
  } else if (user) {
    subTasks.push({
      customId: getNewId(),
      description: `User "${user.email}" sent this feedback, but do not notify.`,
      createdAt: getDate(),
      createdBy: context.appVariables.feedbackUserId,
    });
  }

  // TODO: consolidate task creation and propagation into one function reused
  // by sendFeedback and createTask
  const task: Omit<ITask, "customId"> = {
    subTasks,
    name: data.feedback,
    description: data.description,
    parent: feedbackBoard.customId,
    rootBlockId: feedbackBoard.rootBlockId,
    priority: BlockPriority.Medium,
    status: status0 ? status0.customId : undefined,
    statusAssignedBy: systemConstants.feedbackUserId,
    createdBy: user.customId,
    createdAt: getDate(),
    type: BlockType.Task,
    assignees: [],
    labels: [],
  };

  const savedTask = await context.block.saveBlock<ITask>(context, task);
  outgoingEventFn(
    context,
    SocketRoomNameHelpers.getBoardRoomName(feedbackBoard.customId),
    {
      actionType: SystemActionType.Create,
      resourceType: SystemResourceType.Task,
      resource: getPublicTaskData(savedTask),
    }
  );
};

export default sendFeedback;
