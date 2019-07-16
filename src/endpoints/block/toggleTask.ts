import accessControlCheck from "./access-control-check";
import { blockActionsMap } from "./actions";
import { blockConstants } from "./constants";

async function toggleTask({
  block,
  data,
  blockModel,
  user,
  accessControlModel
}) {
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

module.exports = toggleTask;
export {};
