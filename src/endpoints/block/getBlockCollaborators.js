const canReadBlock = require("./canReadBlock");
const { validateBlockParam } = require("./validation");

async function getBlockCollaborators({ block, blockModel, userModel }) {
  block = validateBlockParam(block);
  block = await blockModel.model
    .findOne({ customId: block.customId })
    .lean()
    .exec();

  await canReadBlock({ block, user });
  let collaborators = await userModel.model
    .find(
      {
        orgs: block.customId
      },
      "name email createdAt customId"
    )
    .lean()
    .exec();

  return {
    collaborators
  };
}

module.exports = getBlockCollaborators;
