import { IRoom } from "../../../mongo/room";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import {
    IOutgoingNewRoomPacket,
    IOutgoingSendMessagePacket,
    IOutgoingUpdateRoomReadCounterPacket,
    OutgoingSocketEvents,
} from "../../socket/server";
import {
    NoRoomOrRecipientProvidedError,
    RoomDoesNotExistError,
} from "../errors";
import { SendMessageEndpoint } from "./type";
import { sendMessageJoiSchema } from "./validation";

const sendMessage: SendMessageEndpoint = async (context, instaData) => {
    const user = await context.session.getUser(context, instaData);
    context.socket.assertSocket(instaData);
    const data = validate(instaData.data, sendMessageJoiSchema);
    const org = await context.block.getBlockById(context, data.orgId);

    canReadBlock({ user, block: org });

    // TODO: how can we eliminate OR make the room fetching faster?
    let room: IRoom;

    if (data.roomId) {
        room = await context.chat.getRoomById(context, data.roomId);
    } else if (data.recipientId) {
        room = await context.chat.insertRoom(
            context,
            data.orgId,
            user.customId,
            null,
            [data.recipientId]
        );
    } else {
        throw new NoRoomOrRecipientProvidedError();
    }

    if (!room) {
        throw new RoomDoesNotExistError();
    }

    if (data.recipientId && !data.roomId) {
        // It's a new room/chat
        context.room.subscribeUser(context, room.name, user.customId);
        context.room.subscribeUser(context, room.name, data.recipientId);

        const newRoomPacket: IOutgoingNewRoomPacket = { room };

        await context.room.broadcast(
            context,
            room.name,
            OutgoingSocketEvents.NewRoom,
            newRoomPacket
        );
    }

    const chat = await context.chat.insertMessage(
        context,
        data.orgId,
        user.customId,
        room.customId,
        data.message
    );

    const outgoingNewMessagePacket: IOutgoingSendMessagePacket = { chat };

    await context.room.broadcast(
        context,
        room.name,
        OutgoingSocketEvents.NewMessage,
        outgoingNewMessagePacket,
        instaData
    );

    if (data.roomId) {
        const readCounter = getDateString();
        await context.chat.updateMemberReadCounter(
            context,
            data.roomId,
            user.customId
        );

        const outgoingUpdateRoomCounterPacket: IOutgoingUpdateRoomReadCounterPacket = {
            roomId: room.customId,
            member: { readCounter, userId: user.customId },
        };

        await context.room.broadcast(
            context,
            room.name,
            OutgoingSocketEvents.UpdateRoomReadCounter,
            outgoingUpdateRoomCounterPacket,
            instaData
        );
    }

    return { chat };
};

export default sendMessage;
