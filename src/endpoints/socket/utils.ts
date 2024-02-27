import {Socket} from 'socket.io';
import {validate} from '../../utilities/joiUtils';
import {AnyFn} from '../../utilities/types';
import {IBaseContext} from '../contexts/IBaseContext';
import RequestData from '../RequestData';
import {IIncomingSocketEventPacket, SocketEventHandler} from './types';
import socketValidationSchemas from './validation';

export function sendAck(fn?: AnyFn, data?: any) {
  // TODO: sometimes, there isn't an ack return function on socket event
  // I think it's because we currently have the socket.io using both http and socket
  // so when it's using http, there isn't an ack fn
  // possible fix is sticking only to socket, but will need to investigate
  //
  // I also think it's because some of the requests are being made before the socket
  // connection completes authentication, so, maybe wait until auth is complete on the client
  if (fn) {
    fn(data);
  }
}

export interface IMakeSocketHandlerOptions {
  skipDataValidation?: boolean;
}

export function makeSocketHandler(
  ctx: IBaseContext,
  socket: Socket,
  handler: SocketEventHandler,
  options: IMakeSocketHandlerOptions = {}
) {
  return async (data: any, fn?: any) => {
    try {
      let validatedData: IIncomingSocketEventPacket<any> | undefined = undefined;
      if (!options.skipDataValidation) {
        validatedData = validate(data, socketValidationSchemas.incomingEventData);
      }

      const requestData = await RequestData.fromSocketRequest(ctx, socket, validatedData);

      const result = await handler(ctx, requestData, fn);
      sendAck(fn, result);
    } catch (error) {
      console.error(error);
      sendAck(fn, {errors: Array.isArray(error) ? error : [error]});
    }
  };
}
