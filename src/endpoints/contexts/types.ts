import {Request} from 'express';
import {IPermissionGroupModel} from '../../mongo/access-control/permissionGroup';
import {IPermissionItemModel} from '../../mongo/access-control/permissionItem';
import {IBoardModel} from '../../mongo/block/board';
import {ITaskModel} from '../../mongo/block/task';
import {IWorkspaceModel} from '../../mongo/block/workspace';
import {IChatModel} from '../../mongo/chat/definitions';
import {IClientModel} from '../../mongo/client/definitions';
import {ICollaborationRequestModel} from '../../mongo/collaboration-request/definitions';
import {ICommentModel} from '../../mongo/comment/definitions';
import {IEavModel} from '../../mongo/eav/eav';
import {
  INotificationModel,
  INotificationSubscriptionModel,
} from '../../mongo/notification/definitions';
import {IChatRoomModel} from '../../mongo/room/definitions';
import {ISprintModel} from '../../mongo/sprint/definitions';
import {ITokenModel} from '../../mongo/token/definitions';
import {IUnseenChatsModel} from '../../mongo/unseen-chats/definitions';
import {IAnonymousUserMongoDbModel, IUserModel} from '../../mongo/user/definitions';
import {IBaseTokenData} from './TokenContext';

export interface IContextMongoDbModels {
  user: IUserModel;
  anonymousUser: IAnonymousUserMongoDbModel;
  notification: INotificationModel;
  comment: ICommentModel;
  sprint: ISprintModel;
  chat: IChatModel;
  chatRoom: IChatRoomModel;
  permissionItem: IPermissionItemModel;
  permissionGroup: IPermissionGroupModel;
  collaborationRequest: ICollaborationRequestModel;
  notificationSubscription: INotificationSubscriptionModel;
  client: IClientModel;
  token: ITokenModel;
  unseenChats: IUnseenChatsModel;
  eav: IEavModel;
  workspace: IWorkspaceModel;
  board: IBoardModel;
  task: ITaskModel;
}

export interface IServerRequest extends Request {
  // decoded JWT token using the expressJWT middleware
  auth?: IBaseTokenData;
}

export interface IAppSocket {
  id: string;
  disconnect: (close?: boolean) => IAppSocket;
  emit: (event: string, ...params: any[]) => boolean;
}
