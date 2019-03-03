const blockModel = require("../mongo/block");
const { validateBlock } = require("./validator");
const findUserPermission = require("../user/findUserPermission");
const getUserFromReq = require("../getUserFromReq");
const { RequestError } = require("../error");

async function toggleTask({ block, data }, req) {
  await validateBlock(block);
  const user = await getUserFromReq(req);
  const role = await findUserPermission(req, block.id);

  // maybe reduce query
  let result = await blockModel.model.findOneAndUpdate(
    {
      _id: block.id,
      type: "task",
      acl: { $elemMatch: { action: "TOGGLE", level: { $lte: role.level } } },
      taskCollaborators: { $elemMatch: { userId: user._id } }
    },
    {
      "taskCollaborators.$.completedAt": data ? Date.now() : null
    },
    { fields: "_id" }
  );

  if (!result || !result._id) {
    throw new RequestError("error", "permission denied");
  }
}

module.exports = toggleTask;
