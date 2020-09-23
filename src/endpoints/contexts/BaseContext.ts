import { Server } from "socket.io";
import { getAuditLogModel } from "../../mongo/audit-log";
import { getBlockModel } from "../../mongo/block";
import { getChatModel } from "../../mongo/chat";
import { getCommentModel } from "../../mongo/comment";
import { getGroupModel } from "../../mongo/chat-group";
import { getNoteModel } from "../../mongo/note";
import { getNotificationModel } from "../../mongo/notification";
import { getUserModel } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getSocketServer } from "../socket/server";
import { getAuditLogContext, IAuditLogContext } from "./AuditLogContext";
import { getBlockContext, IBlockContext } from "./BlockContext";
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
import { getSessionContext, ISessionContext } from "./Session";
import { getSocketContext, ISocketContext } from "./SocketContext";
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
    chat: IChatContext;
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
    public models: IContextModels = {
        userModel: getUserModel(),
        blockModel: getBlockModel(),
        notificationModel: getNotificationModel(),
        auditLogModel: getAuditLogModel(),
        noteModel: getNoteModel(),
        commentModel: getCommentModel(),
        chatModel: getChatModel(),
        groupModel: getGroupModel()
    };
    public socketServer: Server = getSocketServer();
    public comment = getCommentContext();
    public chat = getChatContext();
}

export const getBaseContext = createSingletonFunc(() => new BaseContext());
