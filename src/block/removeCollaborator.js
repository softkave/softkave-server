const { validateBlock } = require("./validator");
const canUserPerformAction = require("./canUserPerformAction");
const userModel = require("../mongo/user");
const deleteUserPermission = require("../user/deleteUserPermission");
const { RequestError } = require("../error");

async function removeCollaborator({ block, collaborator }, req) {
  await validateBlock(block);
  const collaboratorData = await userModel.model
    .findOne(
      {
        _id: collaborator.id,
        permissions: { $elemMatch: { blockId: block.owner } }
      },
      "permissions"
    )
    .lean()
    .exec();

  if (!collaboratorData) {
    throw new RequestError("error", "collaborator does not exist.");
  }

  const collaboratorPermission = collaboratorData.permissions.find(
    permission => permission.blockId === block.owner
  );

  await canUserPerformAction(
    req,
    `REMOVE_${collaboratorPermission.role}`,
    block.owner
  );
  await deleteUserPermission(collaborator, block.owner);
}

module.exports = removeCollaborator;
