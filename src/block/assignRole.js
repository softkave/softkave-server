const {
  validateBlock,
  validateRole
} = require("./validator");
const {
  RequestError
} = require("../error");
const canUserPerformAction = require("./canUserPerformAction");
const userModel = require("../mongo/user");
const {
  validateMongoId
} = require("../validation-utils");
const notificationModel = require("../mongo/notification");
const getUserFromReq = require("../getUserFromReq");
const {
  trimObject
} = require("../utils");

async function assignRole({
  block,
  collaborator,
  role
}, req) {
  await validateBlock(block);
  await validateMongoId(collaborator);
  await validateRole(role);
  trimObject(role);

  let ownerBlock = await canUserPerformAction(req, block, "ASSIGN_ROLE", "roles type name");
  let savedRole = ownerBlock.roles.find(r => {
    if (r.role === role.role && r.hierarchy === role.hierarchy) {
      return true;
    }

    return false;
  });

  if (!savedRole) {
    throw new RequestError("error", "role does not exist");
  }

  const user = await getUserFromReq(req);
  let c = await userModel.model
    .findOneAndUpdate({
      _id: collaborator,
      roles: {
        $elemMatch: {
          blockId: block.id
        }
      }
    }, {
      $pull: {
        "roles.blockId": block.id
      },
      $push: {
        roles: {
          blockId: block.id,
          role: role.role,
          hierarchy: role.hierarchy,
          type: ownerBlock.type,
          assignedBy: user._id,
          assigedAt: Date.now()
        }
      }
    }, {
      fields: "_id email name"
    })
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
      } in ${ownerBlock.name}. Goodluck!
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