import { IRoom } from "../../../mongo/room";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import {
    IOutgoingNewRoomPacket,
    IOutgoingSendMessagePacket,
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
            context.room.getNewRoomId(),
            [data.recipientId]
        );
    } else {
        throw new NoRoomOrRecipientProvidedError();
    }

    if (!room) {
        throw new RoomDoesNotExistError();
    }

    if (data.recipientId) {
        // It's a new room/chat
        context.room.subscribeUser(context, room.name, user.customId);
        context.room.subscribeUser(context, room.name, data.recipientId);

        const newRoomPacket: IOutgoingNewRoomPacket = { room };

        const userRoomName = context.room.getUserRoomName(user.customId);
        await context.room.broadcast(
            context,
            userRoomName,
            OutgoingSocketEvents.NewRoom,
            newRoomPacket
        );

        const recipientUserRoomName = context.room.getUserRoomName(
            data.recipientId
        );
        await context.room.broadcast(
            context,
            recipientUserRoomName,
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

    return { chat };
};

export default sendMessage;
