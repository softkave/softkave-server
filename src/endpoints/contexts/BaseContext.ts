import { Server } from "socket.io";
import { getPermissionModel } from "../../mongo/access-control/PermissionModel";
import { getPermissionGroupsModel } from "../../mongo/access-control/PermissionGroupsModel";
import { getUserAssignedPermissionGroupsModel } from "../../mongo/access-control/UserAssignedPermissionGroupsModel";
import { getBlockModel } from "../../mongo/block";
import { getChatModel } from "../../mongo/chat";
import { getCollaborationRequestModel } from "../../mongo/collaboration-request";
import { getCommentModel } from "../../mongo/comment";
import { getNotificationModel } from "../../mongo/notification";
import { getNotificationSubscriptionModel } from "../../mongo/notification/NotificationSubscriptionModel";
import { getRoomModel } from "../../mongo/room";
import { getSprintModel } from "../../mongo/sprint";
import { getUserModel } from "../../mongo/user";
import {
  appVariables,
  checkVariablesExist,
} from "../../resources/appVariables";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getSocketServer } from "../socket/server";
import { getAccessControlContext } from "./AccessControlContext";
import { getBlockContext, IBlockContext } from "./BlockContext";
import { getBroadcastHistoryContext } from "./BroadcastHistoryContext";
import { getChatContext } from "./ChatContext";
import {
  getCollaborationRequestContext,
  ICollaborationRequestContext,
} from "./CollaborationRequestContext";
import { getCommentContext } from "./CommentContext";
import {
  getNotificationContext,
  INotificationContext,
} from "./NotificationContext";
import { getRoomContext, IRoomContext } from "./RoomContext";
import { getSessionContext, ISessionContext } from "./SessionContext";
import { getSocketContext, ISocketContext } from "./SocketContext";
import { getSprintContext } from "./SprintContext";
import { IContextModels } from "./types";
import { getUserContext, IUserContext } from "./UserContext";
import { getClientContext } from "./ClientContext";
import { getTokenContext } from "./TokenContext";
import { getClientModel } from "../../mongo/client";
import { getTokenModel } from "../../mongo/token";
import { getUnseenChatsContext } from "./UnseenChatsContext";
import { getUnseenChatsModel } from "../../mongo/unseen-chats";
import webPush from "web-push";
import { getWebPushContext } from "./WebPushContext";
import {
  ICustomSelectionOption,
  ICustomProperty,
  ICustomPropertyValue,
} from "../../mongo/custom-property/definitions";
import { IEntityAttrValue, getEntityAttrValueModel } from "../../mongo/eav";
import { getTaskHistoryItemModel } from "../../mongo/task-history";
import NotImplementedDataProvider from "./data-providers/NotImplementedDataProvider";
import { getTaskHistoryContext } from "./TaskHistoryContext";
import { IDataProvider } from "./data-providers/DataProvider";
import MongoDataProvider from "./data-providers/MongoDataProvider";
import { throwEAVNotFoundError } from "../eav/utils";
import { IBaseContext } from "./IBaseContext";
import { ISocketMapContext, SocketMapContext } from "./SocketMapContext";
import { ISocketRoomContext, SocketRoomContext } from "./SocketRoomContext";

export interface IBaseContextDataProviders {
  customOption: IDataProvider<ICustomSelectionOption>;
  customProperty: IDataProvider<ICustomProperty>;
  customValue: IDataProvider<ICustomPropertyValue>;
  entityAttrValue: IDataProvider<IEntityAttrValue>;
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
  public taskHistory = getTaskHistoryContext();
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
    taskHistory: getTaskHistoryItemModel(),
  };
  public socketServerInstance: Server = getSocketServer();
  public appVariables = appVariables;
  public webPushInstance = webPush;
  public socketMap: ISocketMapContext = new SocketMapContext();
  public socketRooms: ISocketRoomContext = new SocketRoomContext();

  public data: IBaseContextDataProviders = {
    customOption: new NotImplementedDataProvider<ICustomSelectionOption>(),
    customProperty: new NotImplementedDataProvider<ICustomProperty>(),
    customValue: new NotImplementedDataProvider<ICustomPropertyValue>(),
    entityAttrValue: new MongoDataProvider<IEntityAttrValue>(
      getEntityAttrValueModel().model,
      throwEAVNotFoundError
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

export const getBaseContext = makeSingletonFn(() => {
  checkVariablesExist();
  return new BaseContext();
});
