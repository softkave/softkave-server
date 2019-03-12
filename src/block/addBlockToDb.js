const blockModel = require("../mongo/block");
const {
  RequestError
} = require("../error");
const addUserRole = require("../user/addUserRole");
const getUserFromReq = require("../getUserFromReq");
const {
  getParentLength
} = require("./utils");

async function addBlockToDb(block, req) {
  try {
    let blockExistQuery = {
      name: block.name ? block.name.toLowerCase() : null,
      type: block.type,
      parents: {
        $all: block.parents,
        $size: getParentLength(block.parents)
      }
    };

    let blockExists = await blockModel.model.findOne(blockExistQuery, "_id").exec();

    if (blockExists) {
      throw new RequestError("name-conflict", "block with same name exists");
    }

    const user = await getUserFromReq(req);
    block.createdBy = user._id;
    block._id = block.id;
    block.createdAt = Date.now();
    let newBlock = new blockModel.model(block);
    newBlock = await newBlock.save();

    if (block.role) {
      try {
        await addUserRole(req, block.role, block);
      } catch (error) {
        console.error(error);

        // TODO: clean unreferenced blocks (blocks with no users)
        blockModel.model.deleteOne({
          _id: newBlock._id
        }).exec().catch(err => console.error(err));

        throw new RequestError("error", "server error");
      }
    }

    return newBlock;
  } catch (error) {
    if (error.code === 11000) {
      console.log(`block with same id - ${block.id}`);
      throw new RequestError("id-conflict", "");
    }

    throw error;
  }
}

module.exports = addBlockToDb;