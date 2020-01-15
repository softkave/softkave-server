import Joi from "joi";
import uuid from "uuid/v4";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IBlockDocument } from "../../mongo/block";
import NotificationModel from "../../mongo/notification/NotificationModel";
import UserModel from "../../mongo/user/UserModel";
import { validate } from "../../utils/joiUtils";
import { joiSchemas } from "../../utils/validationUtils";
import { notificationConstants } from "../notification/constants";
import deleteOrgIDFromUser from "../user/deleteOrgIDFromUser";
import { IUserDocument } from "../user/user";
import userError from "../user/userError";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";

export interface IRemoveCollaboratorParameters {
  block: IBlockDocument;
  collaborator: string;
  user: IUserDocument;
  notificationModel: NotificationModel;
  accessControlModel: AccessControlModel;
  userModel: UserModel;
}

const removeCollaboratorJoiSchema = Joi.object().keys({
  collaborator: joiSchemas.uuidSchema
});

async function removeCollaborator({
  block,
  collaborator,
  user,
  notificationModel,
  accessControlModel,
  userModel
}: IRemoveCollaboratorParameters) {
  const result = validate({ collaborator }, removeCollaboratorJoiSchema);
  collaborator = result.collaborator;

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
    throw userError.collaboratorDoesNotExist;
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
        Hi ${fetchedCollaborator.name}, we're sorry to inform you that you have been removed from ${ownerBlock.name}. Goodluck!
      `,
      to: {
        email: fetchedCollaborator.email,
        userId: fetchedCollaborator.customId
      },
      type: notificationConstants.notificationTypes.removeCollaborator
    });

    notification.save().catch((error: Error) => {
      // For debugging purposes
      console.error(error);
    });
  }
}

export default removeCollaborator;
