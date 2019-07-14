const { getOrgIDs } = require("../user/utils");

async function getRoleBlocks({ user, blockModel }) {
  const orgIds = getOrgIDs(user);
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
export {};
