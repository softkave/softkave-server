import { getTestAccessControlContext } from "./TestAccessControlContext";
import { getTestAuditLogContext } from "./TestAuditLogContext";
import { getTestBlockContext } from "./TestBlockContext";
import { getTestBroadcastHistoryContext } from "./TestBroadcastHistoryContext";
import { getTestChatContext } from "./TestChatContext";
import { getTestClientContext } from "./TestClientContext";
import { getTestCommentContext } from "./TestCommentContext";
import { getTestNotificationContext } from "./TestNotificationContext";
import { getTestRoomContext } from "./TestRoomContext";
import { getTestSessionContext } from "./TestSessionContext";
import { getTestSocketContext, ITestSocketContext } from "./TestSocketContext";
import { getTestSprintContext } from "./TestSprintContext";
import { getTestTokenContext } from "./TestTokenContext";
import { getTestUnseenChatsContext } from "./TestUnseenChatsContext";
import { getTestUserContext } from "./TestUserContext";
import {
  getTestWebPushContext,
  ITestWebPushContext,
} from "./TestWebPushContext";
import { getTestCollaborationRequestContext } from "./TestCollaborationRequestContext";
import { IBaseContext } from "../../contexts/IBaseContext";
import {
  ICustomSelectionOption,
  ICustomProperty,
  ICustomPropertyValue,
} from "../../../mongo/custom-property/definitions";
import { IEntityAttrValue } from "../../../mongo/eav";
import MemoryDataProvider from "../../contexts/data-providers/MemoryDataProvider";
import {
  throwCustomOptionNotFoundError,
  throwCustomPropertyNotFoundError,
  throwCustomValueNotFoundError,
} from "../../customProperty/utils";
import { throwEAVNotFoundError } from "../../eav/utils";
import { IAppVariables } from "../../../resources/appVariables";
import {
  ISocketMapContext,
  SocketMapContext,
} from "../../contexts/SocketMapContext";
import {
  ISocketRoomContext,
  SocketRoomContext,
} from "../../contexts/SocketRoomContext";

export interface ITestBaseContext extends IBaseContext {
  socket: ITestSocketContext;
  webPush: ITestWebPushContext;
}

export class TestBaseContext implements ITestBaseContext {
  public block = getTestBlockContext();
  public user = getTestUserContext();
  public collaborationRequest = getTestCollaborationRequestContext();
  public notification = getTestNotificationContext();
  public auditLog = getTestAuditLogContext();
  public session = getTestSessionContext();
  public socket = getTestSocketContext();
  public room = getTestRoomContext();
  public broadcastHistory = getTestBroadcastHistoryContext();
  public sprint = getTestSprintContext();
  public comment = getTestCommentContext();
  public chat = getTestChatContext();
  public accessControl = getTestAccessControlContext();
  public client = getTestClientContext();
  public token = getTestTokenContext();
  public unseenChats = getTestUnseenChatsContext();
  public taskHistory = {} as any;
  public webPush = getTestWebPushContext();
  public models = {} as any;
  public socketServerInstance = {} as any;
  public appVariables: IAppVariables = {
    clientDomain: "https://www.softkave.com",
    mongoDbURI: "",
    jwtSecret: "12345",
    nodeEnv: "test",
    feedbackBoardId: "",
    feedbackUserId: "",
    port: "",
    vapidPublicKey: "Hello",
    vapidPrivateKey: "Hello",
    disableEmail: true,
    appName: "Softkave",
    emailSendFrom: "hello@softkave.com",
    emailEncoding: "UTF-8",
    dateFormat: "MMM DD, YYYY",
    signupPath: `https://www.softkave.com/signup`,
    loginPath: `https://www.softkave.com/login`,
    changePasswordPath: `https://www.softkave.com/change-password`,
    confirmEmailAddressPath: `https://www.softkave.com/confirm-email-address`,
    awsAccessKeyId: "",
    awsRegion: "",
    awsSecretAccessKey: "",
  };

  public socketMap: ISocketMapContext = new SocketMapContext();
  public socketRooms: ISocketRoomContext = new SocketRoomContext();
  public webPushInstance = {} as any;
  public data = {
    customOption: new MemoryDataProvider<ICustomSelectionOption>(
      [],
      throwCustomOptionNotFoundError
    ),
    customProperty: new MemoryDataProvider<ICustomProperty>(
      [],
      throwCustomPropertyNotFoundError
    ),
    customValue: new MemoryDataProvider<ICustomPropertyValue>(
      [],
      throwCustomValueNotFoundError
    ),
    entityAttrValue: new MemoryDataProvider<IEntityAttrValue>(
      [],
      throwEAVNotFoundError
    ),
  };
}

export const getTestBaseContext = () => {
  return new TestBaseContext();
};
