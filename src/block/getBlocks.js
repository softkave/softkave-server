const blockModel = require("../mongo/block");
const {
  getPermissionQuery,
  getPermissionObjByBlockIds
} = require("./permission-utils");
const getUserFromReq = require("../getUserFromReq");
const { RequestError } = require("../error");
const { validateUUID } = require("../validation-utils");

async function getBlocks({ blocks }, req) {
  if (blocks.length > 50) {
    throw new RequestError("blocks", "maximum length exceeded");
  }

  // TODO: blocks should be an array of ids
  let existingIds = {};
  const blockIds = [];
  blocks.forEach(block => {
    validateUUID(block.id);

    if (!existingIds[block.id]) {
      blockIds.push(block.id);
      existingIds[block.id] = 1;
    }
  });

  // to free memory
  existingIds = null;

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
