import { IGetUserDataContext, IGetUserDataResult } from "./types";

export interface IRevokeRequestParameters {
  request: string;
  block: IBlockDocument;
  notificationModel: NotificationModel;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

const revokeRequestJoiSchema = Joi.object().keys({
  request: joiSchemas.uuidSchema
});

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
  const result = validate({ request }, revokeRequestJoiSchema);
  request = result.request;

  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.REVOKE_COLLABORATION_REQUEST
  });

  const notification = await notificationModel.model
    .findOneAndUpdate(
      {
        ["customId"]: request,
        "from.blockId": block.customId,
        "statusHistory.status": {
          $not: {
            $in: [
              notificationConstants.collaborationRequestStatusTypes.accepted,
              notificationConstants.collaborationRequestStatusTypes.declined
            ]
          }
        }
      },
      {
        $push: {
          statusHistory: {
            status:
              notificationConstants.collaborationRequestStatusTypes.revoked,
            date: Date.now()
          }
        }
      },
      {
        fields: "customId"
      }
    )
    .lean()
    .exec();

  if (!notification) {
    throw notificationError.requestHasBeenSentBefore;
  }
}

export default getUserData;
