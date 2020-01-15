import Joi from "joi";
import NotificationModel from "../../mongo/notification/NotificationModel";
import { validate } from "../../utils/joiUtils";
import notificationError from "../../utils/notificationError";
import { joiSchemas } from "../../utils/validationUtils";
import { IUserDocument } from "./user";
import { collaborationRequestSchema } from "./validation";

// TODO: define data's type
export interface IUpdateCollaborationRequestParameters {
  customId: string;
  data: any;
  user: IUserDocument;
  notificationModel: NotificationModel;
}

const updateCollaborationRequestJoiSchema = Joi.object().keys({
  customId: joiSchemas.uuidSchema,
  data: collaborationRequestSchema
});

async function updateCollaborationRequest({
  customId,
  data,
  user,
  notificationModel
}: IUpdateCollaborationRequestParameters) {
  const result = validate(
    { customId, data },
    updateCollaborationRequestJoiSchema
  );
  customId = result.customId;
  data = result.data;
  const notification = await notificationModel.model
    .findOneAndUpdate(
      {
        customId,
        "to.email": user.email
      },
      data,
      {
        fields: "customId"
      }
    )
    .lean()
    .exec();

  if (!!!notification) {
    throw notificationError.requestDoesNotExist;
  }
}

export default updateCollaborationRequest;
