const { validateBlock, validateRole } = require("./validator");
const { RequestError } = require("../error");
const canUserPerformAction = require("./canUserPerformAction");
const findUserPermission = require("../user/findUserPermission");
const userModel = require("../mongo/user");
const { validateUUID } = require("../validation-utils");
const notificationModel = require("../mongo/notification");
const getUserFromReq = require("../getUserFromReq");

async function assignRole({ block, collaborator, role }, req) {
  await validateBlock(block);
  validateUUID(collaborator);
  await validateRole(role);

  const userRole = await findUserPermission(req, block.id);
  let ownerBlock = await canUserPerformAction(
    block.id,
    "ASSIGN_ROLE",
    userRole,
    "roles type name"
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

  const user = await getUserFromReq(req);
  let c = await userModel.model
    .findOneAndUpdate(
      {
        _id: collaborator,
        permissions: { $elemMatch: { blockId: block.id } }
      },
      {
        $pull: { "permissions.blockId": block.id },
        $push: {
          permissions: {
            blockId: block.id,
            role: role.role,
            level: role.level,
            type: ownerBlock.type,
            assignedBy: user._id,
            assigedAt: Date.now()
          }
        }
      },
      { fields: "_id email name" }
    )
    .exec();

  if (!c) {
    throw new RequestError("error", "collaborator does not exist");
  }

  // send notification to the collaborator
  sendNotification();
  return;

  async function sendNotification() {
    let notification = new notificationModel.model({
      from: {
        userId: user._id,
        name: user.name,
        blockId: ownerBlock.id,
        blockName: ownerBlock.name,
        blockType: ownerBlock.type
      },
      createdAt: Date.now(),
      body: `
        Hi ${c.name}, you have been assigned the role ${role.role} by ${
        user.name
      }.
      `,
      to: {
        email: c.email,
        userId: c._id
      },
      type: "assign_role"
    });

    notification.save().catch(error => {
      console.error(error);
    });
  }
}

module.exports = assignRole;
