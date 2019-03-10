const {
  validateBlock
} = require("./validator");
const findUserRole = require("../user/findUserRole");
const userModel = require("../mongo/user");

async function getBlockCollaborators({
  block
}, req) {
  await validateBlock(block);

  // it validates if user can read block, hence collaborators
  await findUserRole(req, block.id);
  let collaborators = await userModel.model
    .find({
        roles: {
          $elemMatch: {
            blockId: block.id
          }
        }
      },
      "name email createdAt roles"
    )
    .lean()
    .exec();

  return {
    collaborators
  };
}

module.exports = getBlockCollaborators;