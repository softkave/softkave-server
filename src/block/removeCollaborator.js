const { validateBlock } = require("./validator");
const canUserPerformAction = require("./canUserPerformAction");
const userModel = require("../mongo/user");
const { validateUUID } = require("../validation-utils");
const getUserFromReq = require("../getUserFromReq");
const notificationModel = require("../mongo/notification");
const { RequestError } = require("../error");

async function removeCollaborator({ block, collaborator }, req) {
  await validateBlock(block);
  validateUUID(collaborator);
  let ownerBlock = await canUserPerformAction(
    req,
    block,
    "REMOVE_COLLABORATOR",
    "type name"
  );

  let c = await userModel.model
    .findOneAndUpdate(
      {
        _id: collaborator,
        roles: {
          $elemMatch: {
            blockId: block.id
          }
        }
      },
      {
        $pull: {
          "roles.blockId": block.id
        }
      },
      {
        fields: "_id email name"
      }
    )
    .exec();

  if (!c) {
    throw new RequestError("error", "collaborator does not exist");
  }

  sendNotification();

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
        }, we're sorry to inform you that you have been removed from ${
        ownerBlock.name
      }. Goodluck!
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
