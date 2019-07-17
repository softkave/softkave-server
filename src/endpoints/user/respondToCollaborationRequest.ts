import BlockModel from "../../mongo/block/BlockModel";
import NotificationModel from "../../mongo/notification/NotificationModel";
import notificationError from "../../utils/notificationError";
import { validators } from "../../utils/validation-utils";
import { notificationConstants } from "../notification/constants";
import addOrgIDToUser from "./addOrgIDToUser";
import { IUserDocument } from "./user";
import { validateCollaborationRequestResponse } from "./validation";

export interface IRespondToCollaborationRequestParameters {
  customId: string;
  response: string;
  notificationModel: NotificationModel;
  user: IUserDocument;
  blockModel: BlockModel;
}

async function respondToCollaborationRequest({
  customId,
  response,
  notificationModel,
  user,
  blockModel
}: IRespondToCollaborationRequestParameters) {
  customId = validators.validateUUID(customId);
  response = validateCollaborationRequestResponse(response);

  const request = await notificationModel.model
    .findOneAndUpdate(
      {
        customId,
        "to.email": user.email,
        "statusHistory.status": {
          $not: {
            $in: [
              notificationConstants.collaborationRequestStatusTypes.accepted,
              notificationConstants.collaborationRequestStatusTypes.declined,
              notificationConstants.collaborationRequestStatusTypes.revoked
            ]
          }
        }
      },
      {
        $push: {
          statusHistory: {
            status: response,
            date: Date.now()
          }
        }
      },
      {
        fields: "customId from"
      }
    )
    .lean()
    .exec();

  if (!!!request) {
    throw notificationError.requestDoesNotExist;
  }

  if (
    response === notificationConstants.collaborationRequestStatusTypes.accepted
  ) {
    const block = await blockModel.model
      .findOne({ customId: request.from.blockId })
      .lean()
      .exec();

    await addOrgIDToUser({ user, ID: block.customId });
    return { block };
  }
}

export default respondToCollaborationRequest;
