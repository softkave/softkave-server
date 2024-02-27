import {IBaseContext} from '../contexts/IBaseContext';
import RequestData from '../RequestData';

export interface IIncomingSocketEventPacket<T> {
  token: string;
  clientId: string;
  data?: T;
}

export interface SocketEventHandler<T = any, R = any> {
  (ctx: IBaseContext, data: RequestData<T>, fn?: any): Promise<R>;
}
