const canReadBlock = require("./canReadBlock");
const { validateBlockParam } = require("./validation");

async function toggleTask({ block, data, blockModel, user }) {
  block = validateBlockParam(block);
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock({ user, block });
  await blockModel.model.updateOne(
    {
      customId: block.customId,
      type: "task",
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
