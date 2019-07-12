const { getOrgIds } = require("../user/utils");

async function getRoleBlocks({ user, blockModel }) {
  const orgIds = getOrgIds(user);
  const query = {
    customId: {
      $in: orgIds
    }
  };

  let blocks = await blockModel.model
    .find(query)
    .lean()
    .exec();

  return {
    blocks
  };
}

module.exports = getRoleBlocks;
