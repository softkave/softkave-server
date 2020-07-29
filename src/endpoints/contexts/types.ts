import { Request } from "express";
import { IAuditLogModel } from "../../mongo/audit-log";
import { IBlockModel } from "../../mongo/block";
import { INoteModel } from "../../mongo/note";
import { INotificationModel } from "../../mongo/notification";
import { IUser, IUserModel } from "../../mongo/user";
import { IBaseUserTokenData } from "../user/UserToken";

export interface IContextModels {
  userModel: IUserModel;
  blockModel: IBlockModel;
  notificationModel: INotificationModel;
  auditLogModel: IAuditLogModel;
  noteModel: INoteModel;
}

export interface IServerRequest extends Request {
  user?: IBaseUserTokenData;
  userData?: IUser;
}
