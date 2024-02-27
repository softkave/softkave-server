import {Server} from 'socket.io';
import * as webPush from 'web-push';
import {IAppVariables} from '../../resources/appVariables';
import {IBroadcastHistoryContext} from './BroadcastHistoryContext';
import {IChatContext} from './ChatContext';
import {IClientContext} from './ClientContext';
import {ICollaborationRequestContext} from './CollaborationRequestContext';
import {ICommentContext} from './CommentContext';
import {INotificationContext} from './NotificationContext';
import {IPendingPromisesContext} from './PendingPromisesContext';
import {ISessionContext} from './SessionContext';
import {ISocketContext} from './SocketContext';
import {ISocketMapContext} from './SocketMapContext';
import {ISocketRoomContext} from './SocketRoomContext';
import {ISprintContext} from './SprintContext';
import {ITokenContext} from './TokenContext';
import {IUnseenChatsContext} from './UnseenChatsContext';
import {IUserContext} from './UserContext';
import {IWebPushContext} from './WebPushContext';
import {IBoardDataProvider} from './data/board/type';
import {IEavDataProvider} from './data/eav/type';
import {IPermissionGroupDataProvider, IPermissionItemDataProvider} from './data/permission/type';
import {ITaskDataProvider} from './data/task/type';
import {ITokenDataProvider} from './data/token/type';
import {IAnonymousUserDataProvider, IUserDataProvider} from './data/user/types';
import {IWorkspaceDataProvider} from './data/workspace/type';
import {IContextMongoDbModels} from './types';

export interface IBaseContextDataProviders {
  anonymousUser: IAnonymousUserDataProvider;
  token: ITokenDataProvider;
  permissionItem: IPermissionItemDataProvider;
  permissionGroup: IPermissionGroupDataProvider;
  user: IUserDataProvider;
  workspace: IWorkspaceDataProvider;
  board: IBoardDataProvider;
  task: ITaskDataProvider;
  eav: IEavDataProvider;
}

export interface IBaseContext {
  user: IUserContext;
  collaborationRequest: ICollaborationRequestContext;
  notification: INotificationContext;
  session: ISessionContext;
  socket: ISocketContext;
  broadcastHistory: IBroadcastHistoryContext;
  models: IContextMongoDbModels;
  comment: ICommentContext;
  sprint: ISprintContext;
  chat: IChatContext;
  client: IClientContext;
  token: ITokenContext;
  unseenChats: IUnseenChatsContext;
  socketMap: ISocketMapContext;
  socketRooms: ISocketRoomContext;
  webPush: IWebPushContext;
  appVariables: IAppVariables;
  socketServerInstance: Server;
  webPushInstance: typeof webPush;
  pendingPromises: IPendingPromisesContext;
  data: IBaseContextDataProviders;
}
