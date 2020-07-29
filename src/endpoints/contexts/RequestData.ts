import { Socket } from "socket.io";
import { IBaseUserTokenData } from "../user/UserToken";
import { IServerRequest } from "./types";

export default class RequestData<
  T = any,
  TokenData extends IBaseUserTokenData = IBaseUserTokenData
> {
  public static fromExpressRequest<DataType>(
    req: IServerRequest,
    data?: DataType
  ): RequestData {
    const requestData = new RequestData();

    requestData.req = req;
    requestData.data = data;
    requestData.tokenData = requestData.tokenData;
    requestData.ips =
      Array.isArray(req.ips) && req.ips.length > 0 ? req.ips : [req.ip];
    requestData.userAgent = req.headers["user-agent"];

    return requestData;
  }

  public static fromSocketRequest<DataType>(
    socket: Socket,
    data?: DataType
  ): RequestData {
    const requestData = new RequestData();

    requestData.socket = socket;
    requestData.data = data;
    requestData.tokenData = requestData.tokenData;
    requestData.ips = [socket.handshake.address];
    requestData.userAgent = socket.handshake.headers
      ? socket.handshake.headers["user-agent"]
      : undefined;

    return requestData;
  }

  public req?: IServerRequest | null;
  public socket?: Socket | null;
  public data?: T;
  public tokenData?: TokenData | null;
  public userAgent?: string;
  public ips: string[];
}
