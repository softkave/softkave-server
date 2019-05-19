const addBlockToDb = require("./addBlockToDb");
const getUserFromReq = require("../getUserFromReq");
const { RequestError } = require("../error");
const addOrgIdToUser = require("../user/addOrgIdToUser");
const blockModel = require("../mongo/block");
const canReadBlock = require("./canReadBlock");
const { validateBlock } = require("./validation");

async function addBlock({ block }, req) {
  block = validateBlock(block);

  if (block.type === "root") {
    throw new RequestError("error", "invalid block type");
  }

  const user = await getUserFromReq(req);

  if (block.type === "org") {
    let result = await addBlockToDb(block, req);

    // TODO: scrub for orgs that are not added to user and add or clean them
    // CONT: you can do this when user tries to read them, or add them again
    await addOrgIdToUser(user, result.customId);
    return {
      block: result
    };
  }

  if (!Array.isArray(block.parents) && block.parents.length <= 0) {
    throw RequestError("error", "error in data");
  }

  const rootParentId = block.parents[0];
  const rootParent = await blockModel.model
    .findOne({ customId: rootParentId })
    .lean()
    .exec();

  await canReadBlock(req, rootParent);

  return {
    block: await addBlockToDb(block, req)
  };
}

module.exports = addBlock;
