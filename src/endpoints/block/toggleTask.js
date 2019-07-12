const { constants: blockConstants } = require("./constants");
const accessControlCheck = require("./accessControlCheck");
const { blockActionsMap } = require("./actions");

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
