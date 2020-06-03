import uuid = require("uuid");
import { INotification, NotificationType } from "../../../mongo/notification";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import logger from "../../../utilities/logger";
import { UserDoesNotExistError } from "../../user/errors";
import canReadBlock from "../canReadBlock";
import { RemoveCollaboratorEndpoint } from "./types";
import { removeCollaboratorJoiSchema } from "./validation";

const removeCollaborator: RemoveCollaboratorEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, removeCollaboratorJoiSchema);
  const user = await context.session.getUser(context.models, instData);
  const block = await context.block.getBlockById(context.models, data.customId);

  canReadBlock({ user, block });

  const fetchedCollaborator = await context.user.getUserById(
    context.models,
    data.collaborator
  );

  if (!fetchedCollaborator) {
    throw new UserDoesNotExistError();
  }

  const collaboratorOrgs = [...fetchedCollaborator.orgs];
  const blockIndexInCollaborator = collaboratorOrgs.findIndex(
    (org) => org.customId === block.customId
  );

  if (blockIndexInCollaborator === -1) {
    return;
  }

  collaboratorOrgs.splice(blockIndexInCollaborator, 1);
  await context.user.updateUserById(
    context.models,
    fetchedCollaborator.customId,
    {
      orgs: collaboratorOrgs,
    }
  );

  const message =
    `Hi ${fetchedCollaborator.name}, ` +
    `we're sorry to inform you that you have been removed from ${block.name}. Have a good day!`;

  const notification: INotification = {
    customId: uuid(),

    // TODO: should we have a from field here?

    createdAt: getDate(),
    body: message,
    to: {
      email: fetchedCollaborator.email,
    },
    type: NotificationType.RemoveCollaborator,
  };

  context.notification
    .saveNotification(context.models, notification)
    .catch((error) => {
      // TODO: should this be a fire and forget?
      logger.error(error);
    });
};

export default removeCollaborator;
