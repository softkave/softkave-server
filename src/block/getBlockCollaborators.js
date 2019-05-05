const userModel = require("../mongo/user");
const canReadBlock = require("./canReadBlock");
const blockModel = require("../mongo/block");

async function getBlockCollaborators({ block }, req) {
  block = await blockModel.model
    .findOne({ customId: block.customId })
    .lean()
    .exec();
  await canReadBlock(req, block);
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
