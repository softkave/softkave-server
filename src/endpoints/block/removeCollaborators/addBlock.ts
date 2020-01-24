import { IGetUserDataContext, IGetUserDataResult } from "./types";

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

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
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

export default getUserData;
