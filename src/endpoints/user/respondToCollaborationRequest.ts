import Joi from "joi";
import BlockModel from "../../mongo/block/BlockModel";
import NotificationModel from "../../mongo/notification/NotificationModel";
import { validate } from "../../utils/joiUtils";
import notificationError from "../../utils/notificationError";
import { joiSchemas, validators } from "../../utils/validationUtils";
import { notificationConstants } from "../notification/constants";
import addOrgIDToUser from "./addOrgIDToUser";
import { IUserDocument } from "./user";
import {
  collaborationRequestResponseSchema,
  validateCollaborationRequestResponse
} from "./validation";

// TODO: Test not allowing action on an expired collaboration request

export interface IRespondToCollaborationRequestParameters {
  customId: string;
  response: string;
  notificationModel: NotificationModel;
  user: IUserDocument;
  blockModel: BlockModel;
}

const respondToCollaborationRequestJoiSchema = Joi.object().keys({
  customId: joiSchemas.uuidSchema,
  response: collaborationRequestResponseSchema
});

async function respondToCollaborationRequest({
  customId,
  response,
  notificationModel,
  user,
  blockModel
}: IRespondToCollaborationRequestParameters) {
  const result = validate(
    { customId, response },
    respondToCollaborationRequestJoiSchema
  );

  customId = result.customId;
  response = result.response;

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
