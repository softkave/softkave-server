import { BlockType, IBlock } from "../../mongo/block";
import { IBaseContext } from "../contexts/BaseContext";
import RequestData from "../contexts/RequestData";
import {
  IBlockUpdatePacket,
  IBoardUpdatePacket,
  OutgoingSocketEvents,
} from "../socket/server";

const broadcastBlockUpdate = async (
  context: IBaseContext,
  instData: RequestData,
  blockId: string,
  updateType: { isNew?: boolean; isUpdate?: boolean; isDelete?: boolean },
  org?: IBlock,
  block?: IBlock
) => {
  if (block.type === BlockType.Task) {
    const data: IBoardUpdatePacket = {};
    const event = OutgoingSocketEvents.BoardUpdate;
    const board = await context.block.getBlockById(context, block.parent);
    const roomName = context.room.getBlockRoomName(board);
    context.room.broadcast(context, roomName, event, data, instData);
  } else {
    const data: IBlockUpdatePacket = { customId: block.customId };

    // TODO: should we do this here, for performance reasons?
    //   or should we pass it in from the caller
    block = block || (await context.block.getBlockById(context, blockId));
    org = org || (await context.block.getBlockById(context, block.rootBlockId));
    const event = OutgoingSocketEvents.BlockUpdate;
    const user = await context.session.getUser(context, instData);

    if (updateType.isNew) {
      data.isNew = true;
      data.block = block;
    } else if (updateType.isUpdate) {
      data.isUpdate = true;
      data.block = block;
    } else if (updateType.isDelete) {
      data.isDelete = true;
    }

    if (updateType.isNew && block.type === BlockType.Org) {
      const userRoomName = context.room.getUserPersonalRoomName(user);
      context.room.broadcast(context, userRoomName, event, data, instData);
      return;
    }

    const blockRoomName = context.room.getBlockRoomName(block);
    context.room.broadcast(context, blockRoomName, event, data, instData);
  }
};

export default broadcastBlockUpdate;
