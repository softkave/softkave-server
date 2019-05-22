const { RequestError } = require("../../utils/error");

async function canReadBlock({ block, user }) {
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
