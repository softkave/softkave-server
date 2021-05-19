import { Socket } from "socket.io";
import { IClientUserView } from "../mongo/client";
import { IToken } from "../mongo/token/definitions";
import { IUser } from "../mongo/user";
import { IBaseContext } from "./contexts/BaseContext";
import { IBaseTokenData } from "./contexts/TokenContext";
import { IServerRequest } from "./contexts/types";
import { IIncomingSocketEventPacket } from "./socket/types";

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
    incomingSocketData?: IIncomingSocketEventPacket<any> | null;
    userAgent?: string;
    ips?: string[];
    user?: IUser | null;
    client?: IClientUserView | null;
}

export default class RequestData<
    T = any,
    TokenData extends IToken = IToken,
    IncomingTokenData extends IBaseTokenData = IBaseTokenData
> {
    public static async fromExpressRequest<DataType>(
        ctx: IBaseContext,
        req: IServerRequest,
        data?: DataType
    ): Promise<RequestData> {
        const requestData = new RequestData({
            req,
            data,
            ips:
                Array.isArray(req.ips) && req.ips.length > 0
                    ? req.ips
                    : [req.ip],
            userAgent: req.headers["user-agent"],
            incomingTokenData: req.user,
        });

        return requestData;
    }

    public static async fromSocketRequest<DataType>(
        ctx: IBaseContext,
        socket: Socket,
        data: IIncomingSocketEventPacket<DataType>
    ): Promise<RequestData> {
        const requestData = new RequestData({
            socket,
            data: data.data,
            incomingSocketData: data,
            ips: [socket.handshake.address],
            userAgent: socket.handshake.headers
                ? socket.handshake.headers["user-agent"]
                : undefined,
        });

        return requestData;
    }

    public req?: IServerRequest | null;
    public socket?: Socket | null;
    public incomingSocketData?: IIncomingSocketEventPacket<any>;
    public data?: T;
    public incomingTokenData?: IncomingTokenData | null;
    public tokenData?: TokenData | null;
    public userAgent?: string;
    public ips: string[];
    public user?: IUser | null;
    public client?: IClientUserView | null;

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
        this.incomingSocketData = arg.incomingSocketData;
    }
}
