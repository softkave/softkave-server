import {SocketEventHandler} from '../types';

const disconnectSocketHandler: SocketEventHandler = async (ctx, data) => {
  // TODO: clear all socket data in the SocketContext
  // and leave all the rooms the socket was a part of
  try {
    ctx.socketMap.removeSocket(ctx.session.assertGetSocket(data).id);
  } catch (error) {
    console.error(error);
  }
};

export default disconnectSocketHandler;
