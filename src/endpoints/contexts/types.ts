import { Request } from "express";
import { IAccessControlPermissionModel } from "../../mongo/access-control/AccessControlActionsMapModel";
import { IAccessControlRoleModel } from "../../mongo/access-control/AccessControlRoleModel";
import { IAuditLogModel } from "../../mongo/audit-log";
import { IBlockModel } from "../../mongo/block";
import { IChatModel } from "../../mongo/chat";
import { ICommentModel } from "../../mongo/comment";
import { INoteModel } from "../../mongo/note";
import { INotificationModel } from "../../mongo/notification";
import { IRoomModel } from "../../mongo/room";
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
    chatModel: IChatModel;
    roomModel: IRoomModel;
    roles: IAccessControlRoleModel;
    permissions: IAccessControlPermissionModel;
}

export interface IServerRequest extends Request {
    user?: IBaseUserTokenData;
    userData?: IUser;
}
