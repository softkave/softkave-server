import { Socket } from "socket.io";
import OperationError from "../../utilities/OperationError";
import { IBaseContext } from "../contexts/BaseContext";
import RequestData from "../contexts/RequestData";

export interface IIncomingSocketEventPacket<T> {
    token: string;
    data: T;
}

export interface IOutgoingSocketEventPacket<T> {
    errors?: OperationError;
    data?: T;
}

// tslint:disable-next-line: interface-name
export interface SocketEventHandler<T = any, R = any> {
    (ctx: IBaseContext, data: RequestData<T>, fn?: any): Promise<R>;
    skipTokenHandling?: boolean;
}
