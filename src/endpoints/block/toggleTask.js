const { constants: blockConstants } = require("./constants");

async function toggleTask({ block, data, blockModel, user }) {
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
