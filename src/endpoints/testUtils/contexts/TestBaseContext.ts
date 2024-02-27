import {getDefaultMongoConnection} from '../../../mongo/defaultConnection';
import {IAppVariables} from '../../../resources/appVariables';
import {checkArgExists} from '../../../utilities/fns';
import {getBaseContextDataProviders, getBaseContextMongoModels} from '../../contexts/BaseContext';
import {getBroadcastHistoryContext} from '../../contexts/BroadcastHistoryContext';
import {getChatContext} from '../../contexts/ChatContext';
import {getClientContext} from '../../contexts/ClientContext';
import {
  getCollaborationRequestContext,
  ICollaborationRequestContext,
} from '../../contexts/CollaborationRequestContext';
import {getCommentContext} from '../../contexts/CommentContext';
import {IBaseContext, IBaseContextDataProviders} from '../../contexts/IBaseContext';
import {getNotificationContext, INotificationContext} from '../../contexts/NotificationContext';
import PendingPromisesContext from '../../contexts/PendingPromisesContext';
import {getSessionContext, ISessionContext} from '../../contexts/SessionContext';
import {getSocketContext} from '../../contexts/SocketContext';
import {ISocketMapContext, SocketMapContext} from '../../contexts/SocketMapContext';
import {ISocketRoomContext, SocketRoomContext} from '../../contexts/SocketRoomContext';
import {getSprintContext} from '../../contexts/SprintContext';
import {getTokenContext} from '../../contexts/TokenContext';
import {IContextMongoDbModels} from '../../contexts/types';
import {getUnseenChatsContext} from '../../contexts/UnseenChatsContext';
import {getUserContext, IUserContext} from '../../contexts/UserContext';
import {ITestWebPushContext, TestWebPushContext} from './TestWebPushContext';

export interface ITestBaseContext extends IBaseContext {
  webPush: ITestWebPushContext;
}

export class TestBaseContext implements ITestBaseContext {
  user: IUserContext = getUserContext();
  collaborationRequest: ICollaborationRequestContext = getCollaborationRequestContext();
  notification: INotificationContext = getNotificationContext();
  session: ISessionContext = getSessionContext();
  broadcastHistory = getBroadcastHistoryContext();
  sprint = getSprintContext();
  comment = getCommentContext();
  chat = getChatContext();
  client = getClientContext();
  token = getTokenContext();
  unseenChats = getUnseenChatsContext();
  models: IContextMongoDbModels = getBaseContextMongoModels();
  socketMap: ISocketMapContext = new SocketMapContext();
  socketRooms: ISocketRoomContext = new SocketRoomContext();
  socket = getSocketContext();
  webPush = new TestWebPushContext();
  webPushInstance = {} as any;
  socketServerInstance = {} as any;
  appVariables: IAppVariables = {
    clientDomain: 'https://www.softkave.com',
    mongoDbURI: checkArgExists(process.env.MONGODB_URI),
    dbName: 'softkave-unit-test',
    jwtSecret: '12345',
    nodeEnv: 'test',
    feedbackBoardId: '',
    feedbackUserId: '',
    port: '',
    vapidPublicKey: 'Hello',
    vapidPrivateKey: 'Hello',
    disableEmail: true, // necessary for unit testing
    appName: 'Softkave',
    emailSendFrom: 'hello@softkave.com',
    emailEncoding: 'UTF-8',
    dateFormat: 'MMM DD, YYYY',
    signupPath: 'https://www.softkave.com/signup',
    loginPath: 'https://www.softkave.com/login',
    changePasswordPath: 'https://www.softkave.com/change-password',
    confirmEmailAddressPath: 'https://www.softkave.com/confirm-email-address',
    awsAccessKeyId: '',
    awsRegion: '',
    awsSecretAccessKey: '',
  };

  data: IBaseContextDataProviders = getBaseContextDataProviders();
  pendingPromises = new PendingPromisesContext();

  waitOnMongoConnection = async () => {
    await getDefaultMongoConnection().wait();
  };

  close = async () => {
    await this.pendingPromises.waitOnPendingPromises();
    await getDefaultMongoConnection().close();
  };
}

export const getTestBaseContext = () => {
  return new TestBaseContext();
};
