async function blockExists({ block, blockModel }) {
  const { name, type, customId, parents } = block;
  let blockExistQuery = {
    name,
    type,
    customId
  };

  if (parents) {
    blockExistQuery.parents = parents;
  }

  let blockExists = await blockModel.model
    .findOne(blockExistQuery, "customId")
    .exec();

  return blockExists;
}

module.exports = blockExists;
export {};
