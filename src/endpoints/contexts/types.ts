import { Request } from "express";
import { IAuditLogModel } from "../../mongo/audit-log";
import { IBlockModel } from "../../mongo/block";
import { ICommentModel } from "../../mongo/comment";
import { INoteModel } from "../../mongo/note";
import { INotificationModel } from "../../mongo/notification";
import { IUser, IUserModel } from "../../mongo/user";
import { IBaseUserTokenData } from "../user/UserToken";
import {IChatModel} from "../../mongo/chat"
import { IGroupModel } from "../../mongo/chat-group";

export interface IContextModels {
  userModel: IUserModel;
  blockModel: IBlockModel;
  notificationModel: INotificationModel;
  auditLogModel: IAuditLogModel;
  noteModel: INoteModel;
  commentModel: ICommentModel;
  chatModel: IChatModel;
  groupModel: IGroupModel;
}

export interface IServerRequest extends Request {
  user?: IBaseUserTokenData;
  userData?: IUser;
}
