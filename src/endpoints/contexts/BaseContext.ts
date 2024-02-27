import {Server} from 'socket.io';
import * as webPush from 'web-push';
import {getPermissionGroupModel} from '../../mongo/access-control/permissionGroup';
import {getPermissionItemModel} from '../../mongo/access-control/permissionItem';
import {getBoardModel} from '../../mongo/block/board';
import {getTaskModel} from '../../mongo/block/task';
import {getWorkspaceModel} from '../../mongo/block/workspace';
import {getChatModel} from '../../mongo/chat/definitions';
import {getClientModel} from '../../mongo/client/definitions';
import {getCollaborationRequestModel} from '../../mongo/collaboration-request/definitions';
import {getCommentModel} from '../../mongo/comment/definitions';
import {getEavModel} from '../../mongo/eav/eav';
import {
  getNotificationModel,
  getNotificationSubscriptionModel,
} from '../../mongo/notification/definitions';
import {getChatRoomModel} from '../../mongo/room/definitions';
import {getSprintModel} from '../../mongo/sprint/definitions';
import {getTokenModel} from '../../mongo/token/definitions';
import {getUnseenChatsModel} from '../../mongo/unseen-chats/definitions';
import {getAnonymousUserMongoDbModel, getUserModel} from '../../mongo/user/definitions';
import {appVariables, checkVariablesExist} from '../../resources/appVariables';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getSocketServer} from '../socket/server';
import {getBroadcastHistoryContext} from './BroadcastHistoryContext';
import {getChatContext} from './ChatContext';
import {getClientContext} from './ClientContext';
import {
  ICollaborationRequestContext,
  getCollaborationRequestContext,
} from './CollaborationRequestContext';
import {getCommentContext} from './CommentContext';
import {IBaseContext, IBaseContextDataProviders} from './IBaseContext';
import {INotificationContext, getNotificationContext} from './NotificationContext';
import PendingPromisesContext from './PendingPromisesContext';
import {ISessionContext, getSessionContext} from './SessionContext';
import {ISocketContext, getSocketContext} from './SocketContext';
import {ISocketMapContext, SocketMapContext} from './SocketMapContext';
import {ISocketRoomContext, SocketRoomContext} from './SocketRoomContext';
import {getSprintContext} from './SprintContext';
import {getTokenContext} from './TokenContext';
import {getUnseenChatsContext} from './UnseenChatsContext';
import {IUserContext, getUserContext} from './UserContext';
import {getWebPushContext} from './WebPushContext';
import {BoardMongoDataProvider} from './data/board/BoardMongoDataProvider';
import {EavMongoDataProvider} from './data/eav/EavMongoDataProvider';
import {PermissionGroupMongoDataProvider} from './data/permission/PermissionGroupMongoDataProvider';
import {PermissionItemMongoDataProvider} from './data/permission/PermissionItemMongoDataProvider';
import {TaskMongoDataProvider} from './data/task/TaskMongoDataProvider';
import {TokenMongoDataProvider} from './data/token/TokenMongoDataProvider';
import {AnonymousUserMongoDataProvider} from './data/user/AnonymousUserMongoDbDataProvider';
import {UserMongoDataProvider} from './data/user/UserMongoDbDataProvider';
import {WorkspaceMongoDataProvider} from './data/workspace/WorkspaceMongoDataProvider';
import {IContextMongoDbModels} from './types';

export default class BaseContext implements IBaseContext {
  user: IUserContext = getUserContext();
  collaborationRequest: ICollaborationRequestContext = getCollaborationRequestContext();
  notification: INotificationContext = getNotificationContext();
  session: ISessionContext = getSessionContext();
  socket: ISocketContext = getSocketContext();
  broadcastHistory = getBroadcastHistoryContext();
  sprint = getSprintContext();
  comment = getCommentContext();
  chat = getChatContext();
  client = getClientContext();
  token = getTokenContext();
  unseenChats = getUnseenChatsContext();
  webPush = getWebPushContext();
  models: IContextMongoDbModels = getBaseContextMongoModels();
  socketServerInstance: Server = getSocketServer();
  appVariables = appVariables;
  webPushInstance = webPush;
  socketMap: ISocketMapContext = new SocketMapContext();
  socketRooms: ISocketRoomContext = new SocketRoomContext();
  data: IBaseContextDataProviders = getBaseContextDataProviders();
  pendingPromises = new PendingPromisesContext();

  constructor() {
    webPush.setVapidDetails(
      'mailto:abayomi@softkave.com',
      appVariables.vapidPublicKey,
      appVariables.vapidPrivateKey
    );
  }
}

export const getBaseContext = makeSingletonFn(() => {
  checkVariablesExist();
  return new BaseContext();
});

export function getBaseContextMongoModels(): IContextMongoDbModels {
  return {
    user: getUserModel(),
    anonymousUser: getAnonymousUserMongoDbModel(),
    notification: getNotificationModel(),
    comment: getCommentModel(),
    sprint: getSprintModel(),
    chat: getChatModel(),
    chatRoom: getChatRoomModel(),
    permissionItem: getPermissionItemModel(),
    collaborationRequest: getCollaborationRequestModel(),
    notificationSubscription: getNotificationSubscriptionModel(),
    client: getClientModel(),
    token: getTokenModel(),
    unseenChats: getUnseenChatsModel(),
    eav: getEavModel(),
    permissionGroup: getPermissionGroupModel(),
    workspace: getWorkspaceModel(),
    board: getBoardModel(),
    task: getTaskModel(),
  };
}

export function getBaseContextDataProviders(): IBaseContextDataProviders {
  return {
    anonymousUser: new AnonymousUserMongoDataProvider(),
    token: new TokenMongoDataProvider(),
    eav: new EavMongoDataProvider(),
    permissionGroup: new PermissionGroupMongoDataProvider(),
    permissionItem: new PermissionItemMongoDataProvider(),
    user: new UserMongoDataProvider(),
    workspace: new WorkspaceMongoDataProvider(),
    board: new BoardMongoDataProvider(),
    task: new TaskMongoDataProvider(),
  };
}
