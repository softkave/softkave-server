import { IBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";

export interface IIncomingSocketEventPacket<T> {
    token: string;
    data?: T;
}

// tslint:disable-next-line: interface-name
export interface SocketEventHandler<T = any, R = any> {
    (ctx: IBaseContext, data: RequestData<T>, fn?: any): Promise<R>;
    skipTokenHandling?: boolean;
}
