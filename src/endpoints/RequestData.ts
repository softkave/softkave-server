import { Socket } from "socket.io";
import { IBaseContext } from "./contexts/BaseContext";
import { IServerRequest } from "./contexts/types";
import {
    IDecodedTokenData,
    IDecodedUserTokenData,
    IGeneralTokenSubject,
} from "./contexts/UserTokenContext";
import { InvalidRequestError } from "./errors";
import { IIncomingSocketEventPacket } from "./socket/types";

export interface IRequestContructorParams<
    T = any,
    TokenData = IDecodedTokenData<IGeneralTokenSubject>
> {
    req?: IServerRequest;
    socket?: Socket;
    data?: T;
    tokenData?: TokenData;
    userAgent?: string;
    ips?: string[];
    clientId?: string;
}

export interface IRequestDataOptions {
    checkUserToken?: boolean;
}

export default class RequestData<
    T = any,
    TokenData extends IDecodedTokenData = IDecodedTokenData
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

        if (req.user) {
            requestData.tokenData = req.user;
        }

        if (options.checkUserToken) {
            // assigns tokenData to requestData in there somewhere
            await ctx.session.getUser(ctx, requestData);

            // TODO: maybe a bad idea to rely on getUser to set tokenData
            //       find a better way
            requestData.clientId = ((requestData.tokenData as unknown) as IDecodedUserTokenData).sub.clientId;
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

        if (!skipTokenHandling) {
            if (!data.token) {
                throw new InvalidRequestError();
            }

            const tokenData = await ctx.session.validateUserToken(
                ctx,
                data.token
            );

            requestData.tokenData = tokenData;
            requestData.clientId = tokenData.sub.clientId;
        }

        return requestData;
    }

    public req?: IServerRequest | null;
    public socket?: Socket | null;
    public data?: T;
    public tokenData?: TokenData | null;
    public userAgent?: string;
    public clientId?: string;
    public ips: string[];

    public constructor(arg?: IRequestContructorParams<T, TokenData>) {
        if (arg) {
            this.req = arg.req;
            this.socket = arg.socket;
            this.data = arg.data;
            this.tokenData = arg.tokenData;
            this.userAgent = arg.userAgent;
            this.ips = arg.ips;
            this.clientId = arg.clientId;
        }
    }
}
