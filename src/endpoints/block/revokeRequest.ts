import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import NotificationModel from "../../mongo/notification/NotificationModel";
import { validate } from "../../utils/joi-utils";
import notificationError from "../../utils/notificationError";
import { joiSchemas, validators } from "../../utils/validation-utils";
import { notificationConstants } from "../notification/constants";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";

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

async function revokeRequest({
  request,
  block,
  notificationModel,
  user,
  accessControlModel
}: IRevokeRequestParameters) {
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

export default revokeRequest;