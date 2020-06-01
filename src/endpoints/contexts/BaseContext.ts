import { getAuditLogModel } from "../../mongo/audit-log";
import { getBlockModel } from "../../mongo/block";
import { getNotificationModel } from "../../mongo/notification";
import { getUserModel } from "../../mongo/user";
import AuditLogContext, { IAuditLogContext } from "./AuditLogContext";
import BlockContext, { IBlockContext } from "./BlockContext";
import NotificationContext, {
  INotificationContext,
} from "./NotificationContext";
import SessionContext, { ISessionContext } from "./Session";
import { IContextModels } from "./types";
import UserContext, { IUserContext } from "./UserContext";

export interface IBaseContext {
  block: IBlockContext;
  user: IUserContext;
  notification: INotificationContext;
  auditLog: IAuditLogContext;
  session: ISessionContext;
  models: IContextModels;
}

export default class BaseContext implements IBaseContext {
  public block: IBlockContext = new BlockContext();
  public user: IUserContext = new UserContext();
  public notification: INotificationContext = new NotificationContext();
  public auditLog: IAuditLogContext = new AuditLogContext();
  public session: ISessionContext = new SessionContext();
  public models: IContextModels = {
    userModel: getUserModel(),
    blockModel: getBlockModel(),
    notificationModel: getNotificationModel(),
    auditLogModel: getAuditLogModel(),
  };
}

let baseContext: BaseContext = null;

export function getBaseContext() {
  if (baseContext) {
    return baseContext;
  }

  baseContext = new BaseContext();
  return baseContext;
}
