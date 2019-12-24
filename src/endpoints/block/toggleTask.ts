import Joi from "joi";
import pick from "lodash/pick";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import {
  IBlockDocument,
  ITaskCollaborator,
  mongoSubTaskSchema,
  mongoTaskCollaborationDataSchema
} from "../../mongo/block";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joi-utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { blockConstants } from "./constants";
import { isUserAssignedToTask } from "./utils";

const taskCollaborationDataFields = Object.keys(
  mongoTaskCollaborationDataSchema
);
const subTaskFields = Object.keys(mongoSubTaskSchema);

export interface IToggleTaskParameters {
  block: IBlockDocument;
  data: boolean;
  blockModel: BlockModel;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

const toggleTaskJoiSchema = Joi.object().keys({
  data: Joi.boolean()
});

async function toggleTask({
  block,
  data,
  blockModel,
  user,
  accessControlModel
}: IToggleTaskParameters) {
  const result = validate({ data }, toggleTaskJoiSchema);

  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.TOGGLE_TASK
  });

  const blockQuery: any = {
    customId: block.customId,
    type: blockConstants.blockTypes.task
  };

  const isCompleted = Boolean(result.data);
  const now = Date.now();
  let updateQuery: any = {
    taskCollaborationData: {
      ...pick(block.taskCollaborationData, taskCollaborationDataFields),
      completedAt: isCompleted ? now : null,
      completedBy: isCompleted ? user.customId : null
    }
  };

  // TODO: THINK ON: should we auto-assign a task to the user if he/she toggles it?
  // if (!isUserAssignedToTask(block, user)) {
  //   const newTaskCollaborator: ITaskCollaborator = {
  //     userId: user.customId,
  //     assignedBy: user.customId,
  //     assignedAt: now
  //   };

  //   updateQuery = {
  //     ...updateQuery,
  //     $push: {
  //       taskCollaborators: newTaskCollaborator
  //     }
  //   };
  // }

  const subTasks = block.subTasks;

  if (Array.isArray(subTasks) && subTasks.length > 0) {
    const newSubTasks = subTasks.map(subTask => ({
      ...pick(subTask, subTaskFields),
      completedAt: isCompleted ? null : now,
      completedBy: isCompleted ? null : user.customId
    }));

    updateQuery = {
      ...updateQuery,
      subTasks: newSubTasks
    };
  }

  await blockModel.model.updateOne(blockQuery, updateQuery);
}

export default toggleTask;
