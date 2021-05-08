import { Socket } from "socket.io";
import { IClient } from "../mongo/client";
import { IToken } from "../mongo/token/definitions";
import { IUser } from "../mongo/user";
import { clientConstants } from "./client/constants";
import { IBaseContext } from "./contexts/BaseContext";
import { IServerRequest } from "./contexts/types";
import { IBaseTokenData } from "./contexts/UserTokenContext";
import { InvalidRequestError } from "./errors";
import { IIncomingSocketEventPacket } from "./socket/types";
import { JWTEndpoints } from "./types";

export interface IRequestContructorParams<
    T = any,
    TokenData = IToken,
    IncomingTokenData extends IBaseTokenData = IBaseTokenData
> {
    req?: IServerRequest;
    socket?: Socket;
    data?: T;
    tokenData?: TokenData;
    incomingTokenData?: IncomingTokenData | null;
    userAgent?: string;
    ips?: string[];
    user?: IUser | null;
    client?: IClient | null;
    clientId?: string | null;
}

export interface IRequestDataOptions {
    checkUserToken?: boolean;
}

export default class RequestData<
    T = any,
    TokenData extends IToken = IToken,
    IncomingTokenData extends IBaseTokenData = IBaseTokenData
> {
    public static async fromExpressRequest<DataType>(
        ctx: IBaseContext,
        req: IServerRequest,
        data?: DataType,
        options: IRequestDataOptions = {}
    ): Promise<RequestData> {
        const requestData = new RequestData();

        requestData.req = req;
        requestData.data = data;
        requestData.ips =
            Array.isArray(req.ips) && req.ips.length > 0 ? req.ips : [req.ip];
        requestData.userAgent = req.headers["user-agent"];
        requestData.incomingTokenData = req.user;
        requestData.clientId = req.headers[
            clientConstants.clientIdHeaderKey
        ] as string;

        if (options.checkUserToken) {
            await ctx.session.getExpressSession(
                ctx,
                requestData,
                true,
                JWTEndpoints.Login
            );
        }

        return requestData;
    }

    public static async fromSocketRequest<DataType>(
        ctx: IBaseContext,
        socket: Socket,
        data: IIncomingSocketEventPacket<DataType>,
        skipTokenHandling?: boolean
    ): Promise<RequestData> {
        const requestData = new RequestData();

        requestData.socket = socket;
        requestData.data = data?.data;
        requestData.ips = [socket.handshake.address];
        requestData.userAgent = socket.handshake.headers
            ? socket.handshake.headers["user-agent"]
            : undefined;
        requestData.clientId = data.clientId;

        if (!skipTokenHandling) {
            if (!data.token) {
                throw new InvalidRequestError();
            }

            const incomingTokenData = await ctx.userToken.decodeToken(
                ctx,
                data.token
            );

            requestData.incomingTokenData = incomingTokenData;
            await ctx.session.getSocketSession(
                ctx,
                requestData,
                true,
                JWTEndpoints.Login
            );
        }

        return requestData;
    }

    public req?: IServerRequest | null;
    public socket?: Socket | null;
    public data?: T;
    public incomingTokenData?: IncomingTokenData | null;
    public tokenData?: TokenData | null;
    public userAgent?: string;
    public ips: string[];
    public user?: IUser | null;
    public client?: IClient | null;
    public clientId?: string | null;

    public constructor(arg?: IRequestContructorParams<T, TokenData>) {
        if (!arg) {
            return;
        }

        this.req = arg.req;
        this.socket = arg.socket;
        this.data = arg.data;
        this.tokenData = arg.tokenData;
        this.incomingTokenData = arg.incomingTokenData as IncomingTokenData;
        this.userAgent = arg.userAgent;
        this.ips = arg.ips;
        this.user = arg.user;
        this.client = arg.client;
        this.clientId = arg.clientId;
    }
}
