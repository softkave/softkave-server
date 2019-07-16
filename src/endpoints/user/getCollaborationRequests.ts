import NotificationModel from "../../mongo/notification/NotificationModel";
import { IUserDocument } from "./user";

export interface IGetCollaborationRequestsParameters {
  user: IUserDocument;
  notificationModel: NotificationModel;
}

async function getCollaborationRequests({
  user,
  notificationModel
}: IGetCollaborationRequestsParameters) {
  const requests = await notificationModel.model
    .find({
      "to.email": user.email
    })
    .lean()
    .exec();

  return {
    requests
  };
}

export default getCollaborationRequests;
