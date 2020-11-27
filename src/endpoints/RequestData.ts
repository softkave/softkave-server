import { Socket } from "socket.io";
import { IBaseContext } from "./contexts/BaseContext";
import { IServerRequest } from "./contexts/types";
import { InvalidRequestError } from "./errors";
import { IIncomingSocketEventPacket } from "./socket/types";
import UserToken, { IBaseUserTokenData } from "./user/UserToken";

export interface IRequestContructorParams<
    T = any,
    TokenData = IBaseUserTokenData
> {
    req?: IServerRequest;
    socket?: Socket;
    data?: T;
    tokenData?: TokenData;
    userAgent?: string;
    ips?: string[];
    clientId?: string;
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

        if (req.user) {
            requestData.clientId = UserToken.getClientId(req.user);
        }

        return requestData;
    }

    public static fromSocketRequest<DataType>(
        ctx: IBaseContext,
        socket: Socket,
        data: IIncomingSocketEventPacket<DataType>,
        skipTokenHandling?: boolean
    ): RequestData {
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

            const tokenData = ctx.session.validateUserToken(ctx, data.token);

            requestData.tokenData = tokenData;
            requestData.clientId = UserToken.getClientId(tokenData);
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
