import { IUserDocument } from "../user";
import NotificationModel from "mongo/notification/NotificationModel";
import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface IUpdateCollaborationRequestParameters {
  customId: string;
  data: any;
  user: IUserDocument;
  notificationModel: NotificationModel;
}

export interface IUpdateCollaborationRequestContext
  extends IBaseEndpointContext {
  data: IUpdateCollaborationRequestParameters;
  getUserNotificationAndUpdate: (
    customId: string,
    email: string,
    data: any
  ) => Promise<any>;
}
