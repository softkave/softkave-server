const addBlockTodDb = require("../block/addBlockToDb");
const randomColor = require("randomcolor");
const uuid = require("uuid/v4");
const getUserFromReq = require("../getUserFromReq");

// TODO: look for users that have no root block and create one for them
async function createRootBlock(user, req) {
  let rootBlock = {
    customId: uuid(),
    name: `root_${user.customId}`,
    createdAt: Date.now(),
    color: randomColor(),
    type: "root",
    createdBy: user.customId
  };

  rootBlock = await addBlockTodDb(rootBlock, req);
  user.rootBlockId = rootBlock.customId;
  await user.save();

  return {
    block: rootBlock
  };
}

module.exports = createRootBlock;
