const { userErrors } = require("../../utils/userError");
const { blockConstants } = require("./constants");

async function canReadBlock({ block, user }) {
  if (user.rootBlockId === block.customId) {
    return true;
  }

  let orgId = null;

  if (block.type === blockConstants.blockTypes.org) {
    orgId = block.customId;
  } else if (Array.isArray(block.parents) && block.parents.length > 0) {
    orgId = block.parents[0];
  }

  if (orgId) {
    if (!!user.orgs.indexOf(orgId) !== -1) {
      return true;
    }
  }

  throw userErrors.permissionDenied;
}

module.exports = canReadBlock;
export {};
