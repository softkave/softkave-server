const addBlockToDb = require("./addBlockToDb");
const { RequestError } = require("../../utils/error");
const canReadBlock = require("./canReadBlock");
const { validateBlock } = require("./validation");
const { blockHasParents } = require("./utils");

async function addBlock({ blockModel, user, block }) {
  block = validateBlock(block);

  if (block.type === "root") {
    throw new RequestError("error", "invalid block type");
  }

  if (block.type === "org") {
    let result = await addBlockToDb(block, req);

    // TODO: scrub for orgs that are not added to user and add or clean them
    // CONT: you can do this when user tries to read them, or add them again
    await user.addOrgIdToUser({ user, id: result.customId });
    return {
      block: result
    };
  }

  if (!blockHasParents(block)) {
    throw RequestError("error", "error in data");
  }

  const rootParentId = block.parents[0];
  const rootParent = await blockModel.model
    .findOne({ customId: rootParentId })
    .lean()
    .exec();

  await canReadBlock({ user, block: rootParent });

  return {
    block: await addBlockToDb({ block, blockModel, user })
  };
}

module.exports = addBlock;
