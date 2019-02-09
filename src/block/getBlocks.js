const blockModel = require("../mongo/block");
const { getPermissionQuery, getPermissionObjByBlockIds } = require("./permission-utils");
const getUserFromReq = require("../getUserFromReq");
const { validateBlock } = require("./validator");
const { RequestError } = require("../error");

async function getBlocks({ blocks }, req) {
  if (blocks.length > 40) {
    throw new RequestError("blocks", "maximum length exceeded");
  }

  const blockIds = [];
  blocks.forEach(block => {
    validateBlock(block);
    blockIds.push(block.id);
  });

  const user = await getUserFromReq(req);
  const permissions = getPermissionObjByBlockIds(user.permissions, blockIds);
  let queries = blocks.map(block => {
    const action = `READ_${block.type}`;
    return {
      _id: block.id,
      acl: getPermissionQuery(action, permissions[block.id])
    };
  });

  let query = {
    $or: queries
  };

  const result = await blockModel.find(query).lean().exec();
  return {
    blocks: result
  };
}

module.exports = getBlocks;