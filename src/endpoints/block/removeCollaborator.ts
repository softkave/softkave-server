import uuid from "uuid/v4";

import { errors: userErrors } from "../../utils/userErrorMessages";
import { validators } from "../../utils/validation-utils";
import { notificationConstants } from "../notification/constants";
import deleteOrgIDFromUser from "../user/deleteOrgIDFromUser";
import accessControlCheck from "./access-control-check";
import { blockActionsMap } from "./actions";

async function removeCollaborator({
  block,
  collaborator,
  user,
  notificationModel,
  accessControlModel,
  userModel
}) {
  collaborator = validators.validateUUID(collaborator);
  const ownerBlock = block;
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.REMOVE_COLLABORATOR
  });

  const fetchedCollaborator = await userModel.model
    .findOne({
      customId: collaborator
    })
    .exec();

  if (!fetchedCollaborator) {
    throw userErrors.collaboratorDoesNotExist;
  }

  await deleteOrgIDFromUser({ user, id: block.customId });
  sendNotification();

  async function sendNotification() {
    const notification = new notificationModel.model({
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
export {};
