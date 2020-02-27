import uuid = require("uuid");
import { INotification } from "../../../mongo/notification";
import { validate } from "../../../utilities/joiUtils";
import logger from "../../../utilities/logger";
import { UserDoesNotExistError } from "../../user/errors";
import canReadBlock from "../canReadBlock";
import { IRemoveCollaboratorContext } from "./types";
import { removeCollaboratorJoiSchema } from "./validation";

async function removeCollaborator(
  context: IRemoveCollaboratorContext
): Promise<void> {
  const result = validate(context.data, removeCollaboratorJoiSchema);
  const user = await context.getUser();
  const block = await context.getBlockByID(result.customId);

  canReadBlock({ user, block });

  const fetchedCollaborator = await context.getUserByCustomID(
    result.collaborator
  );

  if (!fetchedCollaborator) {
    throw new UserDoesNotExistError();
  }

  const collaboratorOrgIDs = [...fetchedCollaborator.orgs];
  const blockIndexInCollaborator = collaboratorOrgIDs.indexOf(block.customId);

  if (blockIndexInCollaborator === -1) {
    return;
  }

  collaboratorOrgIDs.splice(blockIndexInCollaborator, 1);
  await context.updateUserByID(fetchedCollaborator.customId, {
    orgs: collaboratorOrgIDs
  });

  const notification: INotification = {
    customId: uuid(),
    from: {
      userId: user.customId,
      name: user.name,
      blockId: block.customId,
      blockName: block.name,
      blockType: block.type
    },
    createdAt: Date.now(),
    body: `
      Hi ${fetchedCollaborator.name}, we're sorry to inform you that you have been removed from ${block.name}. Goodluck!
    `,
    to: {
      email: fetchedCollaborator.email,
      userId: fetchedCollaborator.customId
    },
    type: "remove-collaborator"
  };

  context
    .sendNotification(notification)
    .then(() => {
      const sentEmailHistory = notification.sentEmailHistory.concat({
        date: Date.now()
      });

      context
        .updateNotificationByID(notification.customId, {
          sentEmailHistory
        })
        .catch(error => {
          logger.error(error);
        });
    })
    .catch(error => {
      logger.error(error);
    });
}

export default removeCollaborator;
