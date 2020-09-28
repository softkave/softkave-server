import { BlockType, IBlock } from "../../mongo/block";
import { IBaseContext } from "../contexts/BaseContext";
import RequestData from "../contexts/RequestData";
import { IBlockUpdatePacket, OutgoingSocketEvents } from "../socket/server";
import { toPublicBlockData } from "./utils";

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

    // TODO: should we do this here, for performance reasons?
    //   or should we pass it in from the caller
    block = block || (await context.block.getBlockById(context, blockId));
    org = org || (await context.block.getBlockById(context, block.rootBlockId));
    const data: IBlockUpdatePacket = {
        customId: block.customId,
        ...updateType,
    };
    const event = OutgoingSocketEvents.BlockUpdate;

    if (updateType.isNew || updateType.isUpdate) {
        // TODO: should we convert the blocks returned from the endpoints to public blocks?
        // PRO: when we eventually implement REST API for the endpoints, it'll prevent
        // the client having access to internal data
        // CON: it may be slower, considering that graphql already kind of does this
        // IDEA: maybe convert the REST version, and others, but leave the endpoints themselves
        // clean
        data.block = toPublicBlockData(block);
    }

    if (block.type === BlockType.Org) {
        if (updateType.isNew) {
            const userRoomName = context.room.getUserRoomName(user.customId);
            context.room.broadcast(
                context,
                userRoomName,
                event,
                data,
                instData
            );
            return;
        }

        const orgCollaborators = await context.user.getOrgUsers(
            context,
            org.customId
        );
        orgCollaborators.forEach((collaborator) => {
            const roomName = context.room.getUserRoomName(
                collaborator.customId
            );
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
