const { RequestError } = require("../../utils/error");
const blockExists = require("./blockExists");

async function addBlockToDb({ block, blockModel, user }) {
  try {
    if (!block.customId) {
      throw new RequestError("error", "no id present");
    }

    if (
      await blockExists({
        blockModel,
        block: {
          name: block.name,
          type: block.type,
          parents: block.parents
        }
      })
    ) {
      throw new RequestError("system.name-conflict", "");
    }

    block.createdBy = user.customId;
    block.createdAt = Date.now();
    let newBlock = new blockModel.model(block);
    newBlock = await newBlock.save();

    return newBlock;
  } catch (error) {
    if (error.code === 11000) {
      console.log(`block with same id - ${block.customId}`);
      throw new RequestError("system.id-conflict", "");
    }

    throw error;
  }
}

module.exports = addBlockToDb;
