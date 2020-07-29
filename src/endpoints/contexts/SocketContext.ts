import createSingletonFunc from "../../utilities/createSingletonFunc";
import { InvalidRequestError } from "../errors";
import RequestData from "./RequestData";

export interface ISocketContext {
  assertSocket: (data: RequestData) => boolean;
}

export default class SocketContext implements ISocketContext {
  public assertSocket(data: RequestData) {
    if (!data.socket) {
      throw new InvalidRequestError();
    }

    return true;
  }
}

export const getSocketContext = createSingletonFunc(() => new SocketContext());
