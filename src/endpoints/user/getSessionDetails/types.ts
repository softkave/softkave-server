import { IUserDocument } from "../user";
import NotificationModel from "mongo/notification/NotificationModel";
import BlockModel from "mongo/block/BlockModel";
import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface IGetSessionDetailsParameters {
  user: IUserDocument;
  notificationModel: NotificationModel;
  blockModel: BlockModel;
}

export interface IGetSessionDetailsContext extends IBaseEndpointContext {
  data: IGetSessionDetailsParameters;
  getNotificationCount: (email: string) => Promise<any>;
  getAssignedTaskCount: (customId: string) => Promise<number>;
  getOrgsCount: (UOL: number) => Promise<number>;
}
