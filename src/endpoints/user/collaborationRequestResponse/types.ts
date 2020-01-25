import NotificationModel from "mongo/notification/NotificationModel";
import { IUserDocument, IUser } from "mongo/user";
import BlockModel from "mongo/block/BlockModel";
import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface IRespondToCollaborationRequestParameters {
  customId: string;
  response: string;
  notificationModel: NotificationModel;
  user: IUserDocument;
  blockModel: BlockModel;
}

export interface IRespondToCollaborationRequestContext
  extends IBaseEndpointContext {
  data: IRespondToCollaborationRequestParameters;
}

export interface IRespondToCollaborationRequestResult {
  user: IUser;
  token: string;
}
