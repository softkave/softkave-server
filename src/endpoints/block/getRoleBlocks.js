async function getRoleBlocks({ user, blockModel }) {
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
