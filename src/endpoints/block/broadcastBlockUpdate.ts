import { BlockType, IBlock } from "../../mongo/block";
import { IBaseContext } from "../contexts/BaseContext";
import RequestData from "../contexts/RequestData";
import { IBlockUpdatePacket, OutgoingSocketEvents } from "../socket/server";

const broadcastBlockUpdate = async (
  context: IBaseContext,
  instData: RequestData,
  blockId: string,
  updateType: { isNew?: boolean; isUpdate?: boolean; isDelete?: boolean },
  org?: IBlock,
  block?: IBlock
) => {
  const user = await context.session.getUser(context, instData);
  context.socket.attachSocketToRequestData(context, instData, user);
  const data: IBlockUpdatePacket = { customId: block.customId, ...updateType };

  // TODO: should we do this here, for performance reasons?
  //   or should we pass it in from the caller
  block = block || (await context.block.getBlockById(context, blockId));
  org = org || (await context.block.getBlockById(context, block.rootBlockId));
  const event = OutgoingSocketEvents.BlockUpdate;

  if (updateType.isNew || updateType.isUpdate) {
    data.block = block;
  }

  if (block.type === BlockType.Org) {
    if (updateType.isNew) {
      const userRoomName = context.room.getUserPersonalRoomName(user);
      context.room.broadcast(context, userRoomName, event, data, instData);
      return;
    }

    const orgCollaborators = await context.user.getOrgUsers(
      context,
      org.customId
    );
    orgCollaborators.forEach((collaborator) => {
      const roomName = context.room.getUserPersonalRoomName(collaborator);
      context.room.broadcast(context, roomName, event, data, instData);
    });

    // TODO: manage room broadcasts yourself, cause if an org is deleted,
    //   the room still remains in memory, and there's currently no way to get
    //   rid of it, except if everybody leaves the room
    return;
  }

  if (block.type === BlockType.Board) {
    const roomName = context.room.getBlockRoomName(org);
    context.room.broadcast(context, roomName, event, data, instData);
    return;
  }

  if (block.type === BlockType.Task) {
    const board = await context.block.getBlockById(context, block.parent);
    const roomName = context.room.getBlockRoomName(board);
    context.room.broadcast(context, roomName, event, data, instData);
    return;
  }
};

export default broadcastBlockUpdate;
