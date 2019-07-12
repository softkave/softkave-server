const uuid = require("uuid/v4");

const { errors: userErrors } = require("../../utils/userErrorMessages");
const deleteOrgIdFromUser = require("../user/deleteOrgIdFromUser");
const { validators } = require("../../utils/validation-utils");
const {
  constants: notificationConstants
} = require("../notification/constants");
const accessControlCheck = require("./accessControlCheck");
const { blockActionsMap } = require("./actions");

async function removeCollaborator({
  block,
  collaborator,
  user,
  notificationModel,
  accessControlModel,
  userModel
}) {
  collaborator = validators.validateUUID(collaborator);
  let ownerBlock = block;
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.REMOVE_COLLABORATOR
  });

  let fetchedCollaborator = await userModel.model
    .findOne({
      customId: collaborator
    })
    .exec();

  if (!fetchedCollaborator) {
    throw userErrors.collaboratorDoesNotExist;
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
          fetchedCollaborator.name
        }, we're sorry to inform you that you have been removed from ${
        ownerBlock.name
      }. Goodluck!
      `,
      to: {
        email: fetchedCollaborator.email,
        userId: fetchedCollaborator.customId
      },
      type: notificationConstants.notificationTypes.removeCollaborator
    });

    notification.save().catch(error => {
      // For debugging purposes
      console.error(error);
    });
  }
}

module.exports = removeCollaborator;
