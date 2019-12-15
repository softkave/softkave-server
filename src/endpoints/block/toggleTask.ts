import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joi-utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import { blockConstants } from "./constants";

// TODO: define the any types
export interface IToggleTaskParameters {
  block: IBlockDocument;
  data: any;
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

  let blockQuery: any = {
    customId: block.customId,
    type: blockConstants.blockTypes.task
  };
  let updateQuery = null;
  const isCompleted = Boolean(result.data);
  const now = Date.now();

  if (block.taskCollaborationType.collaborationType === "collective") {
    updateQuery = {
      taskCollaborationType: {
        completedAt: isCompleted ? now : null,
        completedBy: isCompleted ? user.customId : null
      }
    };
  } else {
    blockQuery = {
      ...blockQuery,
      taskCollaborators: {
        $elemMatch: {
          userId: user.customId
        }
      }
    };
    updateQuery = {
      "taskCollaborators.$.completedAt": isCompleted ? now : null
    };
  }

  await blockModel.model.updateOne(blockQuery, updateQuery);
}

export default toggleTask;
