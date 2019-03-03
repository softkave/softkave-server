const { validateBlock } = require("./validator");
const findUserPermission = require("../user/findUserPermission");
const userModel = require("../mongo/user");

async function getBlockCollaborators({ block }, req) {
  await validateBlock(block);

  await findUserPermission(req, block.id);
  let collaborators = await userModel.model
    .find(
      {
        permissions: { $elemMatch: { blockId: block.id } }
      },
      "name email createdAt"
    )
    .lean()
    .exec();

  return {
    collaborators
  };
}

module.exports = getBlockCollaborators;
