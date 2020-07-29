import { Server, Socket } from "socket.io";
import getUserFromRequest, {
  validateUserToken,
} from "../../middlewares/getUserFromRequest";
import { IBlock } from "../../mongo/block";
import { INotification } from "../../mongo/notification";
import { getUserModel, IUserModel } from "../../mongo/user";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { getBaseContext } from "../contexts/BaseContext";
import RoomContext, { IRoomContext } from "../contexts/RoomContext";
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

async function onConnection(
  roomContext: IRoomContext,
  socket: Socket,
  userModel: IUserModel
) {
  socket.on(
    IncomingSocketEvents.Auth,
    async (data: IIncomingAuthPacket, fn) => {
      try {
        const user = await validateUserToken(data.token, userModel, true);
        roomContext.saveUserSocketId(socket, user.customId);

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
    onDisconnect(roomContext, socket, userModel);
  });

  socket.on(IncomingSocketEvents.Subscribe, (data) => {
    subscribe(getBaseContext(), data);
  });

  socket.on(IncomingSocketEvents.Unsubscribe, (data) => {
    unsubscribe(getBaseContext(), data);
  });
}

async function onDisconnect(
  roomContext: IRoomContext,
  socket: Socket,
  userModel: IUserModel
) {
  try {
    const user = await getUserFromRequest({
      req: socket.request,
      userModel,
    });

    roomContext.removeUserSocketId(socket, user.customId);
  } catch (error) {
    logger.error(error);
  }
}

let socketServer: Server = null;

export function setupSocketServer(io: Server) {
  socketServer = io;
  io.on("connection", (socket) => {
    onConnection(new RoomContext(), socket, getUserModel());
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
  NewNotifications = "newNotifications",
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
