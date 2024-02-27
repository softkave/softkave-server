import {Socket} from 'socket.io';
import {SystemResourceType} from '../models/system';
import {IClient} from '../mongo/client/definitions';
import {IToken} from '../mongo/token/definitions';
import {IUser} from '../mongo/user/definitions';
import {getNewId02} from '../utilities/ids';
import {clientConstants} from './clients/constants';
import {IBaseContext} from './contexts/IBaseContext';
import {IBaseTokenData, IGeneralTokenSubject} from './contexts/TokenContext';
import {IAppSocket, IServerRequest} from './contexts/types';
import {IIncomingSocketEventPacket} from './socket/types';

export interface IRequestContructorParams<T = any> {
  req?: IServerRequest;
  socket?: IAppSocket;
  data?: T;
  tokenData?: IToken;
  incomingTokenData?: IBaseTokenData<IGeneralTokenSubject>;
  incomingSocketData?: IIncomingSocketEventPacket<any>;
  userAgent?: string;
  ips?: string[];
  user?: IUser;
  clientId?: string;
  client?: IClient;
}

export default class RequestData<T = any> {
  static fromExpressRequest<DataType>(
    ctx: IBaseContext,
    req: IServerRequest,
    data?: DataType
  ): RequestData<DataType> {
    const requestData = new RequestData({
      req,
      data,
      ips: Array.isArray(req.ips) && req.ips.length > 0 ? req.ips : [req.ip],
      userAgent: req.headers['user-agent'],
      incomingTokenData: req.auth,
      clientId: req.headers[clientConstants.clientIdHeaderKey] as string,
    });

    return requestData;
  }

  static async fromSocketRequest<DataType>(
    ctx: IBaseContext,
    socket: Socket,
    data?: IIncomingSocketEventPacket<DataType>
  ): Promise<RequestData> {
    const requestData = new RequestData({
      socket,
      data: data?.data,
      incomingSocketData: data,
      ips: [socket.handshake.address],
      userAgent: socket.handshake.headers ? socket.handshake.headers['user-agent'] : undefined,
      incomingTokenData: data?.token ? ctx.token.decodeToken(ctx, data.token) : undefined,
      clientId: data?.clientId,
    });

    return requestData;
  }

  public static clone<T = undefined>(from: RequestData, data: T): RequestData<T> {
    return new RequestData({
      data,
      socket: from.socket,
      ips: from.ips,
      userAgent: from.userAgent,
      incomingTokenData: from.incomingTokenData,
      clientId: from.clientId,
      client: from.client,
      req: from.req,
      tokenData: from.tokenData,
      user: from.user,
    });
  }

  req?: IServerRequest;
  socket?: IAppSocket;
  incomingSocketData?: IIncomingSocketEventPacket<any>;
  data?: T;
  incomingTokenData?: IBaseTokenData<IGeneralTokenSubject>;
  tokenData?: IToken;
  userAgent?: string;
  ips?: string[];
  user?: IUser;
  clientId?: string;
  client?: IClient;
  reqType?: 'express' | 'socket';
  requestId: string;

  constructor(arg: IRequestContructorParams<T>) {
    this.requestId = getNewId02(SystemResourceType.EndpointRequest);
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
      this.reqType = 'express';
    } else {
      this.reqType = 'socket';
    }
  }
}
