const uuid = require("uuid/v4");
const { RequestError } = require("../../utils/error");
const canReadBlock = require("./canReadBlock");
const deleteOrgIdFromUser = require("../user/deleteOrgIdFromUser");
const { validateBlockParam } = require("./validation");
const { validateUUID } = require("../../utils/validation-utils");

async function removeCollaborator({
  block,
  collaborator,
  user,
  blockModel,
  notificationModel,
  userModel
}) {
  block = validateBlockParam(block);
  collaborator = validateUUID(collaborator);
  let ownerBlock = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock({ user, block: ownerBlock });

  let c = await userModel.model
    .findOne({
      customId: collaborator
    })
    .exec();

  if (!c) {
    throw new RequestError("error", "collaborator does not exist");
  }

  await deleteOrgIdFromUser({ user, id: block.customId });
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
