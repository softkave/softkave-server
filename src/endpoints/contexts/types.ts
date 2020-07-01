import { Socket } from "socket.io";
import { IAuditLogModel } from "../../mongo/audit-log";
import { IBlockModel } from "../../mongo/block";
import { INoteModel } from "../../mongo/note";
import { INotificationModel } from "../../mongo/notification";
import { IUserModel } from "../../mongo/user";
import { IServerRequest } from "../../utilities/types";

export interface IBulkUpdateByIdItem<T> {
  id: string;
  data: Partial<T>;
}

export interface IContextModels {
  userModel: IUserModel;
  blockModel: IBlockModel;
  notificationModel: INotificationModel;
  auditLogModel: IAuditLogModel;
  noteModel: INoteModel;
}

export interface IEndpointInstanceData<T = any> {
  req: IServerRequest;
  data: T;
  socket?: Socket;
}
