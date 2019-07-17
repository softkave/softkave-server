import NotificationModel from "../../mongo/notification/NotificationModel";
import notificationError from "../../utils/notificationError";
import { validators } from "../../utils/validation-utils";
import { IUserDocument } from "./user";
import { validateCollaborationRequest } from "./validation";

// TODO: define data's type
export interface IUpdateCollaborationRequestParameters {
  customId: string;
  data: any;
  user: IUserDocument;
  notificationModel: NotificationModel;
}

async function updateCollaborationRequest({
  customId,
  data,
  user,
  notificationModel
}: IUpdateCollaborationRequestParameters) {
  customId = validators.validateUUID(customId);
  data = validateCollaborationRequest(data);
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
