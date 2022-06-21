import { Socket } from "socket.io";
import { IClient } from "../mongo/client";
import { IToken } from "../mongo/token/definitions";
import { IUser } from "../mongo/user";
import { clientConstants } from "./clients/constants";
import { IBaseContext } from "./contexts/IBaseContext";
import { IBaseTokenData, IGeneralTokenSubject } from "./contexts/TokenContext";
import { IServerRequest } from "./contexts/types";
import { IIncomingSocketEventPacket } from "./socket/types";

export interface IRequestContructorParams<T = any> {
  req?: IServerRequest;
  socket?: Socket;
  data?: T;
  tokenData?: IToken;
  incomingTokenData?: IBaseTokenData<IGeneralTokenSubject> | null;
  incomingSocketData?: IIncomingSocketEventPacket<any> | null;
  userAgent?: string;
  ips?: string[];
  user?: IUser | null;
  clientId?: string | null;
  client?: IClient | null;
}

export default class RequestData<T = any> {
  public static fromExpressRequest<DataType>(
    ctx: IBaseContext,
    req: IServerRequest,
    data?: DataType
  ): RequestData<DataType> {
    const requestData = new RequestData({
      req,
      data,
      ips: Array.isArray(req.ips) && req.ips.length > 0 ? req.ips : [req.ip],
      userAgent: req.headers["user-agent"],
      incomingTokenData: req.user,
      clientId: req.headers[clientConstants.clientIdHeaderKey] as string,
    });

    return requestData;
  }

  public static async fromSocketRequest<DataType>(
    ctx: IBaseContext,
    socket: Socket,
    data: IIncomingSocketEventPacket<DataType> | null
  ): Promise<RequestData> {
    const requestData = new RequestData({
      socket,
      data: data?.data,
      incomingSocketData: data,
      ips: [socket.handshake.address],
      userAgent: socket.handshake.headers
        ? socket.handshake.headers["user-agent"]
        : undefined,
      incomingTokenData: data?.token
        ? ctx.token.decodeToken(ctx, data.token)
        : null,
      clientId: data?.clientId,
    });

    return requestData;
  }

  // TODO: make an abstraction for req and socket, and replace
  // with all uses of socket and req
  // CAUTION: do not use socket or req directly
  public req?: IServerRequest | null;
  public socket?: Socket | null;

  public incomingSocketData?: IIncomingSocketEventPacket<any>;
  public data?: T;
  public incomingTokenData?: IBaseTokenData<IGeneralTokenSubject> | null;
  public tokenData?: IToken | null;
  public userAgent?: string;
  public ips: string[];
  public user?: IUser | null;
  public clientId?: string | null;
  public client?: IClient | null;
  public reqType?: "express" | "socket";

  public constructor(arg?: IRequestContructorParams<T>) {
    if (!arg) {
      return;
    }

    this.req = arg.req;
    this.socket = arg.socket;
    this.data = arg.data;
    this.tokenData = arg.tokenData;
    this.incomingTokenData = arg.incomingTokenData;
    this.userAgent = arg.userAgent;
    this.ips = arg.ips;
    this.user = arg.user;
    this.clientId = arg.clientId;
    this.client = arg.client;
    this.incomingSocketData = arg.incomingSocketData;

    if (arg.req) {
      this.reqType = "express";
    } else {
      this.reqType = "socket";
    }
  }
}
