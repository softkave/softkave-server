const getUserFromReq = require("../getUserFromReq");
const { RequestError } = require("../error");

async function canReadBlock(req, block) {
  const user = await getUserFromReq(req);

  if (user.rootBlockId === block.customId) {
    return true;
  }

  let orgId = null;

  if (block.type === "org") {
    orgId = block.customId;
  } else if (Array.isArray(block.parents) && block.parents.length > 0) {
    orgId = block.parents[0];
  }

  if (orgId) {
    if (!!user.orgs.indexOf(orgId) !== -1) {
      return true;
    }
  }

  throw new RequestError("error", "invalid access");
}

module.exports = canReadBlock;
