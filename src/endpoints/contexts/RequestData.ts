import { Socket } from "socket.io";
import { IBaseUserTokenData } from "../user/UserToken";
import { IServerRequest } from "./types";

interface IRequestContructorParams<T, TokenData> {
  req?: IServerRequest;
  socket?: Socket;
  data?: T;
  tokenData?: TokenData;
  userAgent?: string;
  ips?: string[];
}

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
    requestData.tokenData = req.user;
    requestData.ips =
      Array.isArray(req.ips) && req.ips.length > 0 ? req.ips : [req.ip];
    requestData.userAgent = req.headers["user-agent"];

    return requestData;
  }

  public static fromSocketRequest<
    DataType,
    TokenData extends IBaseUserTokenData
  >(socket: Socket, data?: DataType, tokenData?: TokenData): RequestData {
    const requestData = new RequestData();

    requestData.socket = socket;
    requestData.data = data;
    requestData.tokenData = tokenData;
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

  public constructor(arg?: IRequestContructorParams<T, TokenData>) {
    if (arg) {
      this.req = arg.req;
      this.socket = arg.socket;
      this.data = arg.data;
      this.tokenData = arg.tokenData;
      this.userAgent = arg.userAgent;
      this.ips = arg.ips;
    }
  }
}
