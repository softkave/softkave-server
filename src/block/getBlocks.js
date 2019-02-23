const blockModel = require("../mongo/block");
const {
  getPermissionQuery,
  getPermissionObjByBlockIds
} = require("./permission-utils");
const getUserFromReq = require("../getUserFromReq");
const { validateBlock } = require("./validator");
const { RequestError } = require("../error");

async function getBlocks({ blocks }, req) {
  if (blocks.length > 50) {
    throw new RequestError("blocks", "maximum length exceeded");
  }

  // blocks should be an array of ids
  const blockIds = [];
  blocks.forEach(block => {
    // validateBlock(block);
    blockIds.push(block.id);
  });

  const user = await getUserFromReq(req);
  const permissions = getPermissionObjByBlockIds(user.permissions, blocks);
  let queries = blocks.map(block => {
    const action = `READ`;
    return {
      _id: block.id,
      acl: getPermissionQuery(action, permissions[block.id])
    };
  });

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
