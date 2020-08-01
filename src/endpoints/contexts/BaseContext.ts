import { Server } from "socket.io";
import { getAuditLogModel } from "../../mongo/audit-log";
import { getBlockModel } from "../../mongo/block";
import { getCommentModel } from "../../mongo/comment";
import { getNoteModel } from "../../mongo/note";
import { getNotificationModel } from "../../mongo/notification";
import { getUserModel } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getSocketServer } from "../socket/server";
import { getAuditLogContext, IAuditLogContext } from "./AuditLogContext";
import { getBlockContext, IBlockContext } from "./BlockContext";
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
  models: IContextModels;
  socketServer: Server;
  comment: ICommentContext;
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
  public models: IContextModels = {
    userModel: getUserModel(),
    blockModel: getBlockModel(),
    notificationModel: getNotificationModel(),
    auditLogModel: getAuditLogModel(),
    noteModel: getNoteModel(),
    commentModel: getCommentModel(),
  };
  public socketServer: Server = getSocketServer();
  public comment = getCommentContext();
}

export const getBaseContext = createSingletonFunc(() => new BaseContext());
