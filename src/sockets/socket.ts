import { Server, Socket } from "socket.io";
import getUserFromRequest from "../middlewares/getUserFromRequest";
import { IUserModel } from "../mongo/user";
import logger from "../utilities/logger";

const userIdToSocketIdsCache: { [key: string]: string[] } = {};

export default class SocketServer {
  public io: Server;
  private userModel: IUserModel;

  constructor(socket: Server, userModel: IUserModel) {
    this.io = socket;
    this.userModel = userModel;
    this.init();
  }

  private init() {
    this.io.on("connection", this.onConnection);
  }

  private async onConnection(socket: Socket) {
    try {
      const user = await getUserFromRequest({
        req: socket.request,
        userModel: this.userModel,
      });

      const cachedData = userIdToSocketIdsCache[user.customId] || [];

      if (!cachedData.includes(socket.id)) {
        cachedData.push(socket.id);
      }

      userIdToSocketIdsCache[user.customId] = cachedData;
      socket.on("disconnect", this.onDisconnect);
    } catch (error) {
      logger.error(error);
      socket.disconnect(true);
    }
  }

  private async onDisconnect(socket: Socket) {
    try {
      const user = await getUserFromRequest({
        req: socket.request,
        userModel: this.userModel,
      });

      const cachedData = userIdToSocketIdsCache[user.customId] || [];
      const i = cachedData.indexOf(socket.id);

      if (i !== -1) {
        cachedData.splice(i, 1);
      }

      if (cachedData.length <= 0) {
        delete userIdToSocketIdsCache[user.customId];
      } else {
        userIdToSocketIdsCache[user.customId] = cachedData;
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
