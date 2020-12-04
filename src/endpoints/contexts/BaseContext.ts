import { Server } from "socket.io";
import { getAccessControlPermissionModel } from "../../mongo/access-control/AccessControlActionsMapModel";
import { getAccessControlRoleModel } from "../../mongo/access-control/AccessControlRoleModel";
import { getAuditLogModel } from "../../mongo/audit-log";
import { getBlockModel } from "../../mongo/block";
import { getChatModel } from "../../mongo/chat";
import { getCollaborationRequestModel } from "../../mongo/collaborationRequest";
import { getCommentModel } from "../../mongo/comment";
import { getNoteModel } from "../../mongo/note";
import { getNotificationModel } from "../../mongo/notification";
import { getNotificationSubscriptionModel } from "../../mongo/notification/NotificationSubscriptionModel";
import { getRoomModel } from "../../mongo/room";
import { getSprintModel } from "../../mongo/sprint";
import { getUserModel } from "../../mongo/user";
import { appVariables, IAppVariables } from "../../resources/appVariables";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getSocketServer } from "../socket/server";
import {
    getAccessControlContext,
    IAccessControlContext,
} from "./AccessControlContext";
import { getAuditLogContext, IAuditLogContext } from "./AuditLogContext";
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
import { getNoteContext, INoteContext } from "./NoteContext";
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

export interface IBaseContext {
    block: IBlockContext;
    user: IUserContext;
    collaborationRequest: ICollaborationRequestContext;
    notification: INotificationContext;
    auditLog: IAuditLogContext;
    session: ISessionContext;
    note: INoteContext;
    socket: ISocketContext;
    room: IRoomContext;
    broadcastHistory: IBroadcastHistoryContext;
    models: IContextModels;
    socketServer: Server;
    comment: ICommentContext;
    sprint: ISprintContext;
    chat: IChatContext;
    accessControl: IAccessControlContext;
    broadcastHelpers: IBroadcastHelpers;
    appVariables: IAppVariables;
}

export default class BaseContext implements IBaseContext {
    public block: IBlockContext = getBlockContext();
    public user: IUserContext = getUserContext();
    public collaborationRequest: ICollaborationRequestContext = getCollaborationRequestContext();
    public notification: INotificationContext = getNotificationContext();
    public auditLog: IAuditLogContext = getAuditLogContext();
    public session: ISessionContext = getSessionContext();
    public note: INoteContext = getNoteContext();
    public socket: ISocketContext = getSocketContext();
    public room: IRoomContext = getRoomContext();
    public broadcastHistory = getBroadcastHistoryContext();
    public sprint = getSprintContext();
    public models: IContextModels = {
        userModel: getUserModel(),
        blockModel: getBlockModel(),
        notificationModel: getNotificationModel(),
        auditLogModel: getAuditLogModel(),
        noteModel: getNoteModel(),
        commentModel: getCommentModel(),
        sprintModel: getSprintModel(),
        chatModel: getChatModel(),
        roomModel: getRoomModel(),
        roles: getAccessControlRoleModel(),
        permissions: getAccessControlPermissionModel(),
        collaborationRequestModel: getCollaborationRequestModel(),
        notificationSubscriptionModel: getNotificationSubscriptionModel(),
    };
    public socketServer: Server = getSocketServer();
    public comment = getCommentContext();
    public chat = getChatContext();
    public accessControl = getAccessControlContext();
    public broadcastHelpers = getBroadcastHelpers();
    public appVariables = appVariables;
}

export const getBaseContext = makeSingletonFunc(() => new BaseContext());
