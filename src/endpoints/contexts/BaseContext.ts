import { Server } from "socket.io";
import { getAuditLogModel } from "../../mongo/audit-log";
import { getBlockModel } from "../../mongo/block";
import { getCommentModel } from "../../mongo/comment";
import { getNoteModel } from "../../mongo/note";
import { getNotificationModel } from "../../mongo/notification";
import { getUserModel } from "../../mongo/user";
import { IAddCommentContext } from "../comment/addComment/types";
import { getSocketServer } from "../socket/server";
import AuditLogContext, { IAuditLogContext } from "./AuditLogContext";
import BlockContext, { IBlockContext } from "./BlockContext";
import CommentContext, { ICommentContext } from "./CommentContext";
import NoteContext, { INoteContext } from "./NoteContext";
import NotificationContext, {
  INotificationContext,
} from "./NotificationContext";
import RoomContext, { IRoomContext } from "./RoomContext";
import SessionContext, { ISessionContext } from "./Session";
import SocketContext, { ISocketContext } from "./SocketContext";
import { IContextModels } from "./types";
import UserContext, { IUserContext } from "./UserContext";

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
  public block: IBlockContext = new BlockContext();
  public user: IUserContext = new UserContext();
  public notification: INotificationContext = new NotificationContext();
  public auditLog: IAuditLogContext = new AuditLogContext();
  public session: ISessionContext = new SessionContext();
  public note: INoteContext = new NoteContext();
  public socket: ISocketContext = new SocketContext();
  public room: IRoomContext = new RoomContext();
  public models: IContextModels = {
    userModel: getUserModel(),
    blockModel: getBlockModel(),
    notificationModel: getNotificationModel(),
    auditLogModel: getAuditLogModel(),
    noteModel: getNoteModel(),
    commentModel: getCommentModel(),
  };
  public socketServer: Server = getSocketServer();
  public comment = new CommentContext();
}

let baseContext: BaseContext = null;

export function getBaseContext() {
  if (baseContext) {
    return baseContext;
  }

  baseContext = new BaseContext();
  return baseContext;
}
