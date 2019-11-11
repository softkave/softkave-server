import AccessControlModel from "./access-control/AccessControlModel";
import BlockModel from "./block/BlockModel";
import NotificationModel from "./notification/NotificationModel";
import UserModel from "./user/UserModel";

export interface IApplicationDBModels {
  blockModel: BlockModel;
  userModel: UserModel;
  notificationModel: NotificationModel;
  accessControlModel: AccessControlModel;
}
