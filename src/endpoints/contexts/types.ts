import { Request } from "express";
import { IAuditLogModel } from "../../mongo/audit-log";
import { IBlockModel } from "../../mongo/block";
import { ICommentModel } from "../../mongo/comment";
import { INoteModel } from "../../mongo/note";
import { INotificationModel } from "../../mongo/notification";
import { ISprintModel } from "../../mongo/sprint";
import { IUser, IUserModel } from "../../mongo/user";
import { IBaseUserTokenData } from "../user/UserToken";

export interface IContextModels {
    userModel: IUserModel;
    blockModel: IBlockModel;
    notificationModel: INotificationModel;
    auditLogModel: IAuditLogModel;
    noteModel: INoteModel;
    commentModel: ICommentModel;
    sprintModel: ISprintModel;
}

export interface IServerRequest extends Request {
    user?: IBaseUserTokenData;
    userData?: IUser;
}
