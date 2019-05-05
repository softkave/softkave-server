const blockModel = require("../mongo/block");
const getUserFromReq = require("../getUserFromReq");
const canReadBlock = require("./canReadBlock");

async function toggleTask({ block, data }, req) {
  const user = await getUserFromReq(req);
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock(req, block);
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
