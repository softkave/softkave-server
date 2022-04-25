import { IBaseContext } from "../contexts/IBaseContext";
import {
  IOutgoingResourceUpdatePacket,
  IOutgoingResourceUpdatePacket02,
  OutgoingSocketEvents,
} from "./outgoingEventTypes";

export default function outgoingEventFn(
  ctx: IBaseContext,
  roomName: string,
  packet: IOutgoingResourceUpdatePacket
) {
  (packet as IOutgoingResourceUpdatePacket02).roomName = roomName;
  ctx.socketRooms.broadcastToRoom(
    ctx,
    roomName,
    OutgoingSocketEvents.ResourceUpdate,
    packet,

    // No need to skip socket ID, client-side will make sure
    // not to duplicate resources.
    /* skipSocketId= */ undefined
  );
}
