const blockModel = require("../mongo/block");
const { RequestError } = require("../error");
const addUserPermission = require("../user/addUserPermission");

async function addBlockToDb(block, req) {
  block.createdBy = user.id;
  block.createdAt = Date.now();
  let newBlock = new blockModel.model(block);
  newBlock = await newBlock.save();
  if (block.permission) {
    try {
      await addUserPermission(req, block.permission);
    } catch (error) {
      console.error(error);
      blockModel.model.deleteOne({ _id: newBlock._id }).exec();
      throw new RequestError("error", "an error occurred.");
    }
  }

  return newBlock;
}

module.exports = addBlockToDb;
