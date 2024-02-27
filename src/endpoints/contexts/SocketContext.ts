import makeSingletonFn from '../../utilities/createSingletonFunc';
import RequestData from '../RequestData';
import {SocketOnlyEndpointError} from '../socket/errors';
import {IAppSocket} from './types';

export interface ISocketContext {
  assertSocket: (data: RequestData) => boolean;
  assertGetSocket: (data: RequestData) => IAppSocket;
}

export default class SocketContext implements ISocketContext {
  assertSocket(data: RequestData) {
    if (!data.socket) {
      throw new SocketOnlyEndpointError();
    }

    return true;
  }

  assertGetSocket(data: RequestData) {
    this.assertSocket(data);
    return data.socket!;
  }
}

export const getSocketContext = makeSingletonFn(() => new SocketContext());
