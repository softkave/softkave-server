const userModel = require("../mongo/user");
const getUserFromReq = require("../getUserFromReq");
const notificationModel = require("../mongo/notification");
const { RequestError } = require("../error");
const blockModel = require("../mongo/block");
const uuid = require("uuid/v4");
const canReadBlock = require("./canReadBlock");
const deleteOrgIdFromUser = require("../user/deleteOrgIdFromUser");

async function removeCollaborator({ block, collaborator }, req) {
  let ownerBlock = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock(req, ownerBlock);

  let c = await userModel.model
    .findOne({
      customId: collaborator
    })
    .exec();

  if (!c) {
    throw new RequestError("error", "collaborator does not exist");
  }

  const user = await getUserFromReq(req);
  await deleteOrgIdFromUser(user, block.customId);
  sendNotification();

  async function sendNotification() {
    let notification = new notificationModel.model({
      customId: uuid(),
      from: {
        userId: user.customId,
        name: user.name,
        blockId: ownerBlock.customId,
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
        userId: c.customId
      },
      type: "remove_collaborator"
    });

    notification.save().catch(error => {
      console.error(error);
    });
  }
}

module.exports = removeCollaborator;
