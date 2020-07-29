import { BlockType, IBlock } from "../../mongo/block";
import { IBaseContext } from "../contexts/BaseContext";
import {
  IBlockUpdatePacket,
  IBoardUpdatePacket,
  OutgoingSocketEvents,
} from "../socket/server";

const broadcastBlockUpdate = async (
  context: IBaseContext,
  blockId: string,
  userId: string,
  updateType: { isNew?: boolean; isUpdate?: boolean; isDelete?: boolean },
  org?: IBlock,
  block?: IBlock
) => {
  let event: string = "";
  let room: IBlock;

  if (block.type === BlockType.Task) {
    const data: IBoardUpdatePacket = {};
    event = OutgoingSocketEvents.BoardUpdate;

    const board = await context.block.getBlockById(
      context.models,
      block.parent
    );

    room = board;
    context.room.broadcastInBlock(context.socketServer, room, event, data);
  } else {
    const data: IBlockUpdatePacket = { customId: block.customId };

    // TODO: should we do this here, for performance reasons?
    // or should we pass it in from the caller
    block =
      block || (await context.block.getBlockById(context.models, blockId));
    org =
      org ||
      (await context.block.getBlockById(context.models, block.rootBlockId));

    event = OutgoingSocketEvents.BlockUpdate;
    room = org;

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
      context.room.broadcastToUserClients(
        context.socketServer,
        userId,
        event,
        data
      );

      return;
    }

    context.room.broadcastInBlock(context.socketServer, room, event, data);
  }
};

export default broadcastBlockUpdate;
