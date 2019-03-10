const blockModel = require("../mongo/block");
const getUserFromReq = require("../getUserFromReq");

async function getRoleBlocks(nullArg, req) {
  const user = await getUserFromReq(req);
  let blockIdArr = user.roles.map(role => role.blockId);
  let blocks = await blockModel.model
    .find({
      _id: {
        $in: blockIdArr
      }
    })
    .lean()
    .exec();

  return {
    blocks
  };
}

module.exports = getRoleBlocks;