const blockModel = require("../mongo/block");
const { validateBlock } = require("./validator");
const findUserPermission = require("../user/findUserPermission");
const { RequestError } = require("../error");

async function updateBlock({ block, data }, req) {
  await validateBlock(block);
  await validateBlock(data);
  const role = await findUserPermission(req, block.id);
  data.updatedAt = Date.now();
  let result = await blockModel.model.findOneAndUpdate(
    {
      _id: block.id,
      acl: { $elemMatch: { action: "UPDATE", level: { $lte: role.level } } }
    },
    data,
    { fields: "_id" }
  );

  if (!result || !result._id) {
    throw new RequestError("error", "permission denied");
  }
}

module.exports = updateBlock;
