const { validateBlock } = require("./validator");
const canUserPerformAction = require("./canUserPerformAction");
const findUserPermission = require("../user/findUserPermission");
const userModel = require("../mongo/user");
const { validateUUID } = require("../validation-utils");
const getUserFromReq = require("../getUserFromReq");
const notificationModel = require("../mongo/notification");

async function removeCollaborator({ block, collaborator }, req) {
  await validateBlock(block);
  validateUUID(collaborator);

  const userRole = await findUserPermission(req, block.id);
  let ownerBlock = await canUserPerformAction(
    block.id,
    "REMOVE_COLLABORATOR",
    userRole,
    "type name"
  );
  let c = await userModel.model
    .findOneAndUpdate(
      {
        _id: collaborator,
        permissions: { $elemMatch: { blockId: block.id } }
      },
      {
        $pull: { "permissions.blockId": block.id }
      },
      { fields: "_id email name" }
    )
    .exec();

  // send notification to the collaborator
  sendNotification();
  return;

  async function sendNotification() {
    const user = await getUserFromReq(req);
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
        Hi ${
          c.name
        }, we're sorry to tell you that you have been removed from the ${
        ownerBlock.type
      } ${ownerBlock.name}.
      `,
      to: {
        email: c.email,
        userId: c._id
      },
      type: "remove_collaborator"
    });

    notification.save().catch(error => {
      console.error(error);
    });
  }
}

module.exports = removeCollaborator;
