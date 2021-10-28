import { Server } from "socket.io";
import { getPermissionModel } from "../../mongo/access-control/PermissionModel";
import { getPermissionGroupsModel } from "../../mongo/access-control/PermissionGroupsModel";
import { getUserAssignedPermissionGroupsModel } from "../../mongo/access-control/UserAssignedPermissionGroupsModel";
import { getBlockModel, IBlock } from "../../mongo/block";
import { getChatModel } from "../../mongo/chat";
import { getCollaborationRequestModel } from "../../mongo/collaboration-request";
import { getCommentModel } from "../../mongo/comment";
import { getNotificationModel } from "../../mongo/notification";
import { getNotificationSubscriptionModel } from "../../mongo/notification/NotificationSubscriptionModel";
import { getRoomModel } from "../../mongo/room";
import { getSprintModel } from "../../mongo/sprint";
import { getUserModel } from "../../mongo/user";
import { appVariables, IAppVariables } from "../../resources/appVariables";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getSocketServer } from "../socket/server";
import {
    getAccessControlContext,
    IAccessControlContext,
} from "./AccessControlContext";
import { getBlockContext, IBlockContext } from "./BlockContext";
import { getBroadcastHelpers, IBroadcastHelpers } from "./BroadcastHelpers";
import {
    getBroadcastHistoryContext,
    IBroadcastHistoryContext,
} from "./BroadcastHistoryContext";
import { getChatContext, IChatContext } from "./ChatContext";
import {
    getCollaborationRequestContext,
    ICollaborationRequestContext,
} from "./CollaborationRequestContext";
import { getCommentContext, ICommentContext } from "./CommentContext";
import {
    getNotificationContext,
    INotificationContext,
} from "./NotificationContext";
import { getRoomContext, IRoomContext } from "./RoomContext";
import { getSessionContext, ISessionContext } from "./SessionContext";
import { getSocketContext, ISocketContext } from "./SocketContext";
import { getSprintContext, ISprintContext } from "./SprintContext";
import { IContextModels } from "./types";
import { getUserContext, IUserContext } from "./UserContext";
import { getClientContext, IClientContext } from "./ClientContext";
import { getTokenContext, ITokenContext } from "./TokenContext";
import { getClientModel } from "../../mongo/client";
import { getTokenModel } from "../../mongo/token";
import {
    getUnseenChatsContext,
    IUnseenChatsContext,
} from "./UnseenChatsContext";
import { getUnseenChatsModel } from "../../mongo/unseen-chats";
import webPush from "web-push";
import { getWebPushContext, IWebPushContext } from "./WebPushContext";
import {
    getCustomPropertyModel,
    getCustomPropertyValueModel,
    getCustomSelectionOptionModel,
} from "../../mongo/custom-property/models";
import { IDataProvider } from "./DataProvider";
import {
    ICustomProperty,
    ICustomPropertyValue,
    ICustomSelectionOption,
} from "../../mongo/custom-property/definitions";
import MongoDataProvider from "./MongoDataProvider";
import {
    throwCustomOptionNotFoundError,
    throwCustomPropertyNotFoundError,
    throwCustomValueNotFoundError,
} from "../customProperty/utils";
import { getEntityAttrValueModel, IEntityAttrValue } from "../../mongo/eav";
import NotImplementedDataProvider from "./NotImplementedDataProvider";

export interface IBaseContextDataProviders {
    customOption: IDataProvider<ICustomSelectionOption>;
    customProperty: IDataProvider<ICustomProperty>;
    customValue: IDataProvider<ICustomPropertyValue>;
    entityAttrValue: IDataProvider<IEntityAttrValue>;
}

export interface IBaseContext {
    block: IBlockContext;
    user: IUserContext;
    collaborationRequest: ICollaborationRequestContext;
    notification: INotificationContext;
    session: ISessionContext;
    socket: ISocketContext;
    room: IRoomContext;
    broadcastHistory: IBroadcastHistoryContext;
    models: IContextModels;
    comment: ICommentContext;
    sprint: ISprintContext;
    chat: IChatContext;
    accessControl: IAccessControlContext;
    client: IClientContext;
    token: ITokenContext;
    unseenChats: IUnseenChatsContext;
    webPush: IWebPushContext;
    broadcastHelpers: IBroadcastHelpers;
    appVariables: IAppVariables;
    socketServerInstance: Server;
    webPushInstance: typeof webPush;

    data: IBaseContextDataProviders;
}

export default class BaseContext implements IBaseContext {
    public block: IBlockContext = getBlockContext();
    public user: IUserContext = getUserContext();
    public collaborationRequest: ICollaborationRequestContext =
        getCollaborationRequestContext();
    public notification: INotificationContext = getNotificationContext();
    public session: ISessionContext = getSessionContext();
    public socket: ISocketContext = getSocketContext();
    public room: IRoomContext = getRoomContext();
    public broadcastHistory = getBroadcastHistoryContext();
    public sprint = getSprintContext();
    public comment = getCommentContext();
    public chat = getChatContext();
    public accessControl = getAccessControlContext();
    public client = getClientContext();
    public token = getTokenContext();
    public unseenChats = getUnseenChatsContext();
    public webPush = getWebPushContext();
    public models: IContextModels = {
        userModel: getUserModel(),
        blockModel: getBlockModel(),
        notificationModel: getNotificationModel(),
        commentModel: getCommentModel(),
        sprintModel: getSprintModel(),
        chatModel: getChatModel(),
        roomModel: getRoomModel(),
        permissionGroup: getPermissionGroupsModel(),
        permissions: getPermissionModel(),
        collaborationRequestModel: getCollaborationRequestModel(),
        notificationSubscriptionModel: getNotificationSubscriptionModel(),
        userAssignedPermissionGroup: getUserAssignedPermissionGroupsModel(),
        clientModel: getClientModel(),
        tokenModel: getTokenModel(),
        unseenChatsModel: getUnseenChatsModel(),
    };
    public socketServerInstance: Server = getSocketServer();
    public broadcastHelpers = getBroadcastHelpers();
    public appVariables = appVariables;
    public webPushInstance = webPush;

    public data: IBaseContextDataProviders = {
        // customOption: new MongoDataProvider<ICustomSelectionOption>(
        //     getCustomSelectionOptionModel(),
        //     throwCustomOptionNotFoundError
        // ),
        // customProperty: new MongoDataProvider<ICustomProperty>(
        //     getCustomPropertyModel(),
        //     throwCustomPropertyNotFoundError
        // ),
        // customValue: new MongoDataProvider<ICustomPropertyValue>(
        //     getCustomPropertyValueModel(),
        //     throwCustomValueNotFoundError
        // ),
        customOption: new NotImplementedDataProvider<ICustomSelectionOption>(),
        customProperty: new NotImplementedDataProvider<ICustomProperty>(),
        customValue: new NotImplementedDataProvider<ICustomPropertyValue>(),
        entityAttrValue: new MongoDataProvider<IEntityAttrValue>(
            getEntityAttrValueModel(),
            throwCustomValueNotFoundError
        ),
    };

    constructor() {
        webPush.setVapidDetails(
            "mailto:abayomi@softkave.com",
            appVariables.vapidPublicKey,
            appVariables.vapidPrivateKey
        );
    }
}

export const getBaseContext = makeSingletonFn(() => new BaseContext());
