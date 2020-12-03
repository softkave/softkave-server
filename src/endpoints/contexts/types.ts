import { Request } from "express";
import { IAccessControlPermissionModel } from "../../mongo/access-control/AccessControlActionsMapModel";
import { IAccessControlRoleModel } from "../../mongo/access-control/AccessControlRoleModel";
import { IAuditLogModel } from "../../mongo/audit-log";
import { IBlockModel } from "../../mongo/block";
import { IChatModel } from "../../mongo/chat";
import { ICollaborationRequestModel } from "../../mongo/collaborationRequest";
import { ICommentModel } from "../../mongo/comment";
import { INoteModel } from "../../mongo/note";
import { INotificationModel } from "../../mongo/notification";
import { INotificationSubscriptionModel } from "../../mongo/notification/NotificationSubscriptionModel";
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
    collaborationRequestModel: ICollaborationRequestModel;
    notificationSubscriptionModel: INotificationSubscriptionModel;
}

export interface IServerRequest extends Request {
    user?: IBaseUserTokenData;
    userData?: IUser;
}
