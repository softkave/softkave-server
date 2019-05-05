const blockModel = require("../mongo/block");
const { RequestError } = require("../error");
const getUserFromReq = require("../getUserFromReq");
const { getParentsLength } = require("./utils");

async function addBlockToDb(block, req) {
  try {
    let blockExistQuery = {
      name: block.name,
      type: block.type
    };

    if (block.customId) {
      blockExistQuery.customId = block.customId;
    } else {
      throw new RequestError("error", "no id present");
    }

    if (block.parents) {
      blockExistQuery.parents = {
        $all: block.parents,
        $size: getParentsLength(block)
      };
    }

    let blockExists = await blockModel.model
      .findOne(blockExistQuery, "customId")
      .exec();

    if (blockExists) {
      throw new RequestError("system.name-conflict", "");
    }

    const user = await getUserFromReq(req);
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
