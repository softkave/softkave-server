import { Server } from "socket.io";
import { getAuditLogModel } from "../../mongo/audit-log";
import { getBlockModel } from "../../mongo/block";
import { getChatModel } from "../../mongo/chat";
import { getCommentModel } from "../../mongo/comment";
import { getNoteModel } from "../../mongo/note";
import { getNotificationModel } from "../../mongo/notification";
import { getRoomModel } from "../../mongo/room";
import { getSprintModel } from "../../mongo/sprint";
import { getUserModel } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getSocketServer } from "../socket/server";
import { getAuditLogContext, IAuditLogContext } from "./AuditLogContext";
import { getBlockContext, IBlockContext } from "./BlockContext";
import BroadcastHelpers, {
    getBroadcastHelpers,
    IBroadcastHelpers,
} from "./BroadcastHelpers";
import {
    getBroadcastHistoryContext,
    IBroadcastHistoryContext,
} from "./BroadcastHistoryContext";
import { getChatContext, IChatContext } from "./ChatContext";
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
    broadcastHelpers: IBroadcastHelpers;
}

export default class BaseContext implements IBaseContext {
    public block: IBlockContext = getBlockContext();
    public user: IUserContext = getUserContext();
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
    };
    public socketServer: Server = getSocketServer();
    public comment = getCommentContext();
    public chat = getChatContext();
    public broadcastHelpers = getBroadcastHelpers();
}

export const getBaseContext = makeSingletonFunc(() => new BaseContext());
