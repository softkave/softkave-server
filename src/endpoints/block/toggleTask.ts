import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joi-utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import { blockConstants } from "./constants";

// TODO: define any types
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
  data = result.data;

  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.TOGGLE_TASK
  });

  await blockModel.model.updateOne(
    {
      customId: block.customId,
      type: blockConstants.blockTypes.task,
      taskCollaborators: {
        $elemMatch: {
          userId: user.customId
        }
      }
    },
    {
      "taskCollaborators.$.completedAt": data ? Date.now() : null
    },
    {
      fields: "customId"
    }
  );
}

export default toggleTask;
