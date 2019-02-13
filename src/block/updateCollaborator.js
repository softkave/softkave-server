const { validateBlock } = require("./validator");
const canUserPerformAction = require("../user/canUserPerformAction");
const userModel = require("../mongo/user");
const updateUserPermission = require("../user/updateUserPermission");
const { RequestError } = require("../error");

async function updateCollaborator({ block, collaborator, data }, req) {
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
    [
      `UPDATE_${collaboratorPermission.role.toUpperCase()}`,
      `ADD_${data.role.toUpperCase()}`
    ],
    block.owner
  );

  await updateUserPermission(collaborator, data, block);
}

module.exports = updateCollaborator;
