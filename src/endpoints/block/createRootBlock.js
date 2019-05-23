const addBlockTodDb = require("../block/addBlockToDb");
const randomColor = require("randomcolor");
const uuid = require("uuid/v4");

// TODO: look for users that have no root block and create one for them
async function createRootBlock({ user, blockModel }) {
  let rootBlock = {
    customId: uuid(),
    name: `root_${user.customId}`,
    createdAt: Date.now(),
    color: randomColor(),
    type: "root",
    createdBy: user.customId
  };

  rootBlock = await addBlockTodDb({ user, blockModel, block: rootBlock });
  user.rootBlockId = rootBlock.customId;
  await user.save();

  return {
    block: rootBlock
  };
}

module.exports = createRootBlock;