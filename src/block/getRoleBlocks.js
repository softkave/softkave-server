const blockModel = require("../mongo/block");
const getUserFromReq = require("../getUserFromReq");

async function getRoleBlocks(nullArg, req) {
  const user = await getUserFromReq(req);
  let blockIdArr = [...user.orgs, user.rootBlockId];
  let blocks = await blockModel.model
    .find({
      customId: {
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
