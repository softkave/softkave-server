const blockModel = require("../mongo/block");
const {
  validateBlock
} = require("./validator");
const canUserPerformAction = require("./canUserPerformAction");
const userModel = require("../mongo/user");

async function deleteBlock({
  block
}, req) {
  await validateBlock(block);
  await canUserPerformAction(req, block, "DELETE");

  let blockChildrenWithRoles = await blockModel.find({
    parents: block.id,
    roles: {
      $size: {
        $gt: 0
      }
    }
  }, "_id").exec();

  let blockChildrenIdArr = blockChildrenWithRoles.map(b => b._id);
  await blockModel.model
    .deleteMany({
      _id: block.id,
      parents: block.id
    })
    .exec();

  let roleBlockIds = blockChildrenIdArr;
  roleBlockIds.push(block.id);

  // TODO: scrub user collection for unreferenced roles
  userModel.model.findAndUpdate({
    roles: {
      $elemMatch: {
        blockId: {
          $in: roleBlockIds
        }
      }
    }
  }, {
    $pull: {
      blockId: {
        $in: roleBlockIds
      }
    }
  }).exec().catch(err => {
    console.log("delete roles ---");
    console.error(err);
    console.dir(roleBlockIds);
    console.log("delete roles ---");
  })
}

module.exports = deleteBlock;