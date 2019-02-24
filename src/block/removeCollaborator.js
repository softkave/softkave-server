const { validateBlock, validateNewCollaborators } = require("./validator");
const canUserPerformAction = require("./canUserPerformAction");
const findUserPermission = require("../user/findUserPermission");
const userModel = require("../mongo/user");

async function removeCollaborator({ block, collaborator }, req) {
  // await validateBlock(block);
  // await validateNewCollaborators(collaborators);

  const userRole = await findUserPermission(req, block.id);
  await canUserPerformAction(block.id, "REMOVE_COLLABORATOR", userRole);
  await userModel.model
    .updateOne(
      {
        _id: collaborator._id,
        permissions: { $elemMatch: { blockId: block.id } }
      },
      {
        $pull: { "permissions.blockId": block.id }
      }
    )
    .exec();

  // send notification to the collaborator
}

module.exports = removeCollaborator;
