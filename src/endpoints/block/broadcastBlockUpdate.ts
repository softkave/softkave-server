import { BlockType, IBlock } from "../../mongo/block";
import { IBaseContext } from "../contexts/BaseContext";
import { OutgoingSocketEvents } from "../socket/server";

const broadcastBlockUpdate = async (
  context: IBaseContext,
  blockId: string,
  updateType: { isNew?: boolean; isUpdate?: boolean; isDelete?: boolean },
  org?: IBlock,
  block?: IBlock
) => {
  let event: string = "";
  let data: any = {};
  let room: IBlock;

  if (block.type === BlockType.Task) {
    event = OutgoingSocketEvents.BoardUpdate;

    const board = await context.block.getBlockById(
      context.models,
      block.parent
    );

    room = board;
    data = { block: { customId: block.customId } };
  } else {
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
      data = { isNew: true, block };
    } else if (updateType.isUpdate) {
      data = { isUpdate: true, block };
    } else if (updateType.isDelete) {
      data = { isDelete: true, block: { customId: block.customId } };
    }
  }

  context.room.broadcastInBlock(context.socketServer, room, event, data);
};

export default broadcastBlockUpdate;
