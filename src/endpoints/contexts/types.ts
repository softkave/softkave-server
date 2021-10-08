import { Request } from "express";
import { IPermissionModel } from "../../mongo/access-control/PermissionModel";
import { IPermissionGroupModel } from "../../mongo/access-control/PermissionGroupsModel";
import { IUserAssignedPermissionGroupModel } from "../../mongo/access-control/UserAssignedPermissionGroupsModel";
import { IBlockModel } from "../../mongo/block";
import { IChatModel } from "../../mongo/chat";
import { ICollaborationRequestModel } from "../../mongo/collaboration-request";
import { ICommentModel } from "../../mongo/comment";
import { INotificationModel } from "../../mongo/notification";
import { INotificationSubscriptionModel } from "../../mongo/notification/NotificationSubscriptionModel";
import { IRoomModel } from "../../mongo/room";
import { ISprintModel } from "../../mongo/sprint";
import { IUserModel } from "../../mongo/user";
import { IClientModel } from "../../mongo/client/Model";
import { ITokenModel } from "../../mongo/token";
import { IUnseenChatsModel } from "../../mongo/unseen-chats";
import { IBaseTokenData } from "./TokenContext";
import {
    ICustomPropertyModel,
    ICustomPropertyValueModel,
    ICustomSelectionOptionModel,
} from "../../mongo/custom-property/models";

export interface IContextModels {
    userModel: IUserModel;
    blockModel: IBlockModel;
    notificationModel: INotificationModel;
    commentModel: ICommentModel;
    sprintModel: ISprintModel;
    chatModel: IChatModel;
    roomModel: IRoomModel;
    permissionGroup: IPermissionGroupModel;
    permissions: IPermissionModel;
    collaborationRequestModel: ICollaborationRequestModel;
    notificationSubscriptionModel: INotificationSubscriptionModel;
    userAssignedPermissionGroup: IUserAssignedPermissionGroupModel;
    clientModel: IClientModel;
    tokenModel: ITokenModel;
    unseenChatsModel: IUnseenChatsModel;
}

export interface IServerRequest extends Request {
    // decoded JWT token using the expressJWT middleware
    user?: IBaseTokenData;
}
