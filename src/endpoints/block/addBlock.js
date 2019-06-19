const addBlockToDb = require("./addBlockToDb");
const { RequestError } = require("../../utils/error");
const canReadBlock = require("./canReadBlock");
const { validateBlock } = require("./validation");
const { blockHasParents, getImmediateParentId } = require("./utils");
const addOrgIdToUser = require("../user/addOrgIdToUser");

async function addBlock({ blockModel, user, block }) {
  block = validateBlock(block);

  if (block.type === "root") {
    throw new RequestError("error", "invalid block type");
  }

  if (block.type === "org") {
    let result = await addBlockToDb({ block, blockModel, user });

    // TODO: scrub for orgs that are not added to user and add or clean them
    // CONT: you can do this when user tries to read them, or add them again
    await addOrgIdToUser({ user, id: result.customId });
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
  block = await addBlockToDb({ block, blockModel, user });
  const pluralizedType = `${block.type}s`;
  const update = {
    [pluralizedType]: block.customId
  };

  if (block.type === "group") {
    update.groupTaskContext = block.customId;
    update.groupProjectContext = block.customId;
  }

  await blockModel.model
    .updateOne({ customId: getImmediateParentId(block) }, { $addToSet: update })
    .exec();

  return {
    block
  };
}

module.exports = addBlock;
