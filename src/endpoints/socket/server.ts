import { Server, Socket } from "socket.io";
import getUserFromRequest, {
  validateUserToken,
} from "../../middlewares/getUserFromRequest";
import { IBlock } from "../../mongo/block";
import { INotification } from "../../mongo/notification";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { getBaseContext, IBaseContext } from "../contexts/BaseContext";
import RequestData from "../contexts/RequestData";
import { CollaborationRequestResponse } from "../user/respondToCollaborationRequest/types";
import subscribe from "./subscribe/subscribe";
import unsubscribe from "./unsubscribe/unsubscribe";

// REMINDER
// The current implementation authenticates once, then accepts all other requests
// This can be problematic in a number of ways
// Fixes include adding the user token to the header and authenticating on every request
// Problem with this is that it's only available when using polling ( which is currently the default option )
//   but this can be problematic if we decide to move to pure web sockets
// Another fix is passing the token with every request, this can work
// But if there's no possibility of exploitation with current implementation,
//   then that  wastes compute resources
// Also, what happens when the user changes their password?
// Maybe if the user changes password or auth token is changed, the socket will only auth again

// TODO: disconnect sockets that don't auth in 5 minutes

async function onConnection(ctx: IBaseContext, socket: Socket) {
  socket.on(
    IncomingSocketEvents.Auth,
    async (data: IIncomingAuthPacket, fn) => {
      try {
        const user = await validateUserToken(
          data.token,
          ctx.models.userModel,
          true
        );
        ctx.socket.mapUserToSocketId(
          RequestData.fromSocketRequest(socket),
          user
        );
        const result: IOutgoingAuthPacket = { valid: true };
        fn(result);
      } catch (error) {
        const result: IOutgoingAuthPacket = { valid: false };
        logger.error(error);
        fn(result);
        socket.disconnect();
      }
    }
  );

  socket.on("disconnect", () => {
    onDisconnect(ctx, socket);
  });

  socket.on(IncomingSocketEvents.Subscribe, (data) => {
    subscribe(getBaseContext(), data);
  });

  socket.on(IncomingSocketEvents.Unsubscribe, (data) => {
    unsubscribe(getBaseContext(), data);
  });
}

async function onDisconnect(ctx: IBaseContext, socket: Socket) {
  try {
    const user = await getUserFromRequest({
      req: socket.request,
      userModel: ctx.models.userModel,
    });

    ctx.socket.removeSocketIdAndUser(RequestData.fromSocketRequest(socket));
  } catch (error) {
    logger.error(error);
  }
}

let socketServer: Server = null;

export function setupSocketServer(io: Server) {
  socketServer = io;
  io.on("connection", (socket) => {
    onConnection(getBaseContext(), socket);
  });
}

export function getSocketServer() {
  if (!socketServer) {
    throw new ServerError();
  }

  return socketServer;
}

enum IncomingSocketEvents {
  Subscribe = "subscribe",
  Unsubscribe = "unsubscribe",
  Auth = "auth",
}

export enum OutgoingSocketEvents {
  BlockUpdate = "blockUpdate",
  OrgNewNotifications = "orgNewNotifications",
  UserNewNotifications = "userNewNotifications",
  UserUpdate = "userUpdate",
  UpdateNotification = "updateNotification",
  UserCollaborationRequestResponse = "userCollabReqResponse",
  OrgCollaborationRequestResponse = "orgCollabReqResponse",
  BoardUpdate = "boardUpdate",
}

export interface IIncomingAuthPacket {
  token: string;
}

export interface IOutgoingAuthPacket {
  valid: boolean;
}

export interface IBlockUpdatePacket {
  customId: string;
  isNew?: boolean;
  isUpdate?: boolean;
  isDelete?: boolean;
  block?: Partial<IBlock>;
}

export interface INewNotificationsPacket {
  notifications: INotification[];
}

export interface IUserUpdatePacket {
  notificationsLastCheckedAt: string;
}

export interface IUpdateNotificationPacket {
  customId: string;
  data: { readAt: string };
}

export interface IUserCollaborationRequestResponsePacket {
  customId: string;
  response: CollaborationRequestResponse;
  org?: IBlock;
}

export interface IOrgCollaborationRequestResponsePacket {
  customId: string;
  response: CollaborationRequestResponse;
}

// tslint:disable-next-line: no-empty-interface
export interface IBoardUpdatePacket {}
