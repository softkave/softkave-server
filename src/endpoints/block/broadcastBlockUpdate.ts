import { BlockType, IBlock } from "../../mongo/block";
import { IBaseContext } from "../contexts/BaseContext";
import RequestData from "../contexts/RequestData";
import { IBlockUpdatePacket, OutgoingSocketEvents } from "../socket/server";
import { getPublicBlockDataExt } from "./utils";

export interface IBroadcastBlockUpdateArgs {
    context: IBaseContext;
    instData: RequestData;
    blockId: string;
    updateType: { isNew?: boolean; isUpdate?: boolean; isDelete?: boolean };
    blockType: BlockType;
    data?: Partial<IBlock>;
    parentId?: string;
    block?: IBlock;
}

const broadcastBlockUpdate = async (args: IBroadcastBlockUpdateArgs) => {
    const { context, instData, updateType, blockId, data, blockType } = args;
    let { block, parentId } = args;
    const user = await context.session.getUser(context, instData);

    // TODO: should we do this here, for performance reasons?
    //      or should we pass it in from the caller

    const eventData: IBlockUpdatePacket = {
        customId: blockId,
        ...updateType,
    };

    const event = OutgoingSocketEvents.BlockUpdate;

    if (updateType.isNew || updateType.isUpdate) {
        // TODO: should we convert the blocks returned from the endpoints to public blocks?
        // Pro: when we eventually implement REST API for the endpoints, it'll prevent
        //      the client having access to internal data
        // Con: it may be slower, considering that graphql already kind of does this
        // Idea: maybe convert the REST version, and others, but leave the endpoints themselves
        // clean
        eventData.block = getPublicBlockDataExt(data);
    }

    if (blockType === BlockType.Org) {
        if (updateType.isNew) {
            const userRoomName = context.room.getUserRoomName(user.customId);
            context.room.broadcast(
                context,
                userRoomName,
                event,
                eventData,
                instData
            );

            return;
        }

        const orgCollaborators = await context.user.getOrgUsers(
            context,
            blockId
        );

        orgCollaborators.forEach((collaborator) => {
            const roomName = context.room.getUserRoomName(
                collaborator.customId
            );

            context.room.broadcast(
                context,
                roomName,
                event,
                eventData,
                instData
            );
        });

        // TODO: manage room broadcasts yourself, cause if an org is deleted,
        //      the room still remains in memory, and there's currently no way to get
        //      rid of it, except if everybody leaves the room
        return;
    }

    if (!parentId) {
        if (!block) {
            block = await context.block.getBlockById(context, blockId);
        }

        parentId = block.parent!;
    }

    if (blockType === BlockType.Board) {
        const roomName = context.room.getBlockRoomName(BlockType.Org, parentId);
        context.room.broadcast(context, roomName, event, eventData, instData);
        return;
    }

    if (block.type === BlockType.Task) {
        const roomName = context.room.getBlockRoomName(
            BlockType.Board,
            parentId
        );

        context.room.broadcast(context, roomName, event, eventData, instData);
        return;
    }
};

export default broadcastBlockUpdate;
