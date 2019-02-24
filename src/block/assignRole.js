const { validateBlock, validateNewCollaborators } = require("./validator");
const { RequestError } = require("../error");
const canUserPerformAction = require("./canUserPerformAction");
const findUserPermission = require("../user/findUserPermission");
const userModel = require("../mongo/user");

async function assignRole({ block, collaborator, role }, req) {
  // await validateBlock(block);
  // await validateNewCollaborators(collaborators);

  const userRole = await findUserPermission(req, block.id);
  let ownerBlock = await canUserPerformAction(
    block.id,
    "ASSIGN_ROLE",
    userRole,
    "roles type"
  );

  let savedRole = ownerBlock.roles.find(r => {
    if (r.role === role.role && r.level === role.level) {
      return true;
    }

    return false;
  });

  if (savedRole) {
    throw new RequestError("error", "role does not exist");
  }

  let c = await userModel.model
    .findOneAndUpdate(
      {
        _id: collaborator.id,
        permissions: { $elemMatch: { blockId: block.id } }
      },
      {
        $pull: { "permissions.blockId": block.id },
        $push: {
          permissions: {
            blockId: block.id,
            role: role.role,
            level: role.level,
            type: ownerBlock.type
          }
        }
      }
    )
    .exec();

  if (!c) {
    throw new RequestError("error", "collaborator does not exist");
  }

  // send notification to the collaborator
}

module.exports = assignRole;
