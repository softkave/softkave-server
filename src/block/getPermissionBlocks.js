const blockModel = require("../mongo/block");
const getUserFromReq = require("../getUserFromReq");

async function getPermissionBlocks(nullArg, req) {
  const user = await getUserFromReq(req);
  let blockIdArr = user.permissions.map(permission => permission.blockId);
  let blocks = await blockModel.model
    .find({
      _id: { $in: blockIdArr }
    })
    .lean()
    .exec();

  return {
    blocks
  };
}

module.exports = getPermissionBlocks;
