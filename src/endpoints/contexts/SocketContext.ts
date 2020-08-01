import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { InvalidRequestError } from "../errors";
import RequestData from "./RequestData";

const socketIdToUserMap: { [key: string]: IUser } = {};

export interface ISocketContext {
  assertSocket: (data: RequestData) => boolean;
  mapUserToSocketId: (data: RequestData, user: IUser) => void;
  removeSocketIdAndUser: (data: RequestData) => void;
  getUserBySocketId: (data: RequestData) => IUser | undefined;
}

export default class SocketContext implements ISocketContext {
  public assertSocket(data: RequestData) {
    if (!data.socket) {
      throw new InvalidRequestError();
    }

    return true;
  }

  public mapUserToSocketId(data: RequestData, user: IUser) {
    socketIdToUserMap[data.socket.id] = user;
  }

  public removeSocketIdAndUser(data: RequestData) {
    delete socketIdToUserMap[data.socket.id];
  }

  public getUserBySocketId(data: RequestData) {
    return socketIdToUserMap[data.socket.id];
  }
}

export const getSocketContext = createSingletonFunc(() => new SocketContext());
