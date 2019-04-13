const blockModel = require("../mongo/block");
const {
  validateBlock
} = require("./validator");
const getUserFromReq = require("../getUserFromReq");
const canUserPerformAction = require("./canUserPerformAction");

async function toggleTask({
  block,
  data
}, req) {
  // await validateBlock(block);
  const user = await getUserFromReq(req);
  await canUserPerformAction(req, block, "TOGGLE_TASK");
  await blockModel.model.updateOne({
    _id: block.id,
    type: "task",
    taskCollaborators: {
      $elemMatch: {
        userId: user._id
      }
    }
  }, {
    "taskCollaborators.$.completedAt": data ? Date.now() : null
  }, {
    fields: "_id"
  });
}

module.exports = toggleTask;