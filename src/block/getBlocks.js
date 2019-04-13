const blockModel = require("../mongo/block");
const {
  RequestError
} = require("../error");
const {
  validateUUID
} = require("../validation-utils");
const {
  indexArr
} = require("../utils");
const findUserRole = require("../user/findUserRole");

async function getBlocks({
  blocks
}, req) {
  if (blocks.length > 50) {
    throw new RequestError("blocks", "maximum length exceeded");
  }

  // TODO: blocks should be an array of ids
  let blockMap = indexArr(blocks, block => {
    // validateUUID(block.id);
    return block.id;
  });

  // TODO: fix, this will only work for blocks that have roles
  // see if you can use canUserPerformAction
  let blockIds = Object.keys(blockMap);
  let queries = await Promise.all(blockIds.map(async block => {
    const role = await findUserRole(req, block.id);
    return {
      _id: block.id,
      "acl.action": "READ",
      "acl.roles": role.role
    };
  }));

  let query = {
    $or: queries
  };

  const result = await blockModel
    .find(query)
    .lean()
    .exec();

  return {
    blocks: result
  };
}

module.exports = getBlocks;